---
title: Writeup for WPICTF Sigknock challenge
tags: [ctf]
---

## WPICTF Sigknock

I recently attend my [first ctf](https://wpictf.xyz) (where my team was 14th!), It was an awesome experience and I really liked the thrill of it. I especially liked one of the `linux` challenges named `$1gkn0ck`:

![challenge desc](/assets/images/sigknock.png)

So I started by researching what [Port Knocking](https://en.wikipedia.org/wiki/Port_knocking) was, and I found out it's a way of opening and closing ports on a machine by sending a pre-defined sequence of connection attempts. This helped me later to crack the puzzle.

So I `ssh`ed into the VM, and didn't notice anything at first. But then I noticed something interesting in the processes:

```bash
~ $ ps aux
PID   USER     TIME  COMMAND
    1 wpictf    0:00 {init_d} /bin/sh /bin/init_d
    6 wpictf    0:00 /usr/bin/irqknock
    7 wpictf    0:00 /bin/sh
    9 wpictf    0:00 ps aux
~ $ 
```

There was an interesting program conveniently named irq**knock**. When I launched the program, nothing was happening until I started fiddling around and noticed that when I inputted `CTRL+C`, the program would react:

```bash
~ $ irqknock
^CGot signal 2
State advanced to 1
```

I then realized that the program only reacted when you triggered a [signal interrupt](https://www.computerhope.com/unix/signals.htm) like CTRL+C or CTRL+Z. So I needed to find the right sequence of signal interrupts that would trigger the program like port knocking to make it give me the flag. Seeing the big list of [64 Unix interrupts](https://www.computerhope.com/unix/signals.htm), I decided to run a bash script to find the ones that made the program react:

```bash
#!/bin/sh
for i in $(seq 1 64)
do
    echo $i
    /usr/bin/irqknock &
    sleep 1
    kill -$i $!
    echo $!
done
```

This program starts irqknock as a daemon and then sends it a signal interruption command with `kill`. It `echo`es the output to the console so I can see if the program has reacted to my nudges.

This was the output:

```bash
~ $ #!/bin/sh
~ $ for i in $(seq 1 64)
> do
>     echo $i
>     /usr/bin/irqknock &
>     sleep 1
>     kill -$i $!
>     echo $!
> done
1
12
2
14
3
Got signal 2
State advanced to 1
16
4
Got signal 3
State advanced to 0
18
5
20
6
22
7
24
8
26
9
28
10
30
11
32
12
Got signal 11
State advanced to 0
34
13
36
14
Got signal 13
State advanced to 0
38
15
40
16
42
17
44
18
Got signal 17
State advanced to 0
... # snipped for brevity
```

This script revealed exactly which signals could induce a reaction: `[2, 3, 11, 13, 17]`

With this information, I tried sending these signals to irqknock in a linear order:

```bash
~ $ irqknock # start new irqknock instance
^Z[2]+  Stopped                    irqknock
~ $ bg
[2] irqknock # retrieve pid of new instance
~ $ ps aux
PID   USER     TIME  COMMAND
    1 wpictf    0:00 {init_d} /bin/sh /bin/init_d
    6 wpictf    0:00 /usr/bin/irqknock
    7 wpictf    0:00 /bin/sh
   10 wpictf    0:00 irqknock
   80 wpictf    0:00 irqknock
   81 wpictf    0:00 ps aux
~ $ kill -2 80 # send signals in linear order
~ $ Got signal 2
State advanced to 1

~ $ kill -3 80
~ $ Got signal 3
State advanced to 2
^C
~ $ kill -11 80
~ $ Got signal 11
State advanced to 3

~ $ kill -13 80
Got signal 13
State advanced to 4
~ $ kill -17 80
Got signal 17
State advanced to 5
WPI{1RQM@St3R}
```

As you can see, it worked! These signals made the program react and send me back the flag in `WPI{...}` format. 

Big thanks to acurless who made this epic challenge!