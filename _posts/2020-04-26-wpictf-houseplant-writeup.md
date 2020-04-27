---
title: Houseplant CTF 2020 Writeups
tags: [ctf, cybersec]
---

## HousePlant 2020

![hp logo](https://houseplant.riceteacatpanda.wtf/img/logo.png)

[Houseplant](https://houseplant.riceteacatpanda.wtf/home) was an awesome CTF I participated in with my team Pwnzorz this weekend. I will be providing writeups for the `Selfhost all the things`, `Catography` and `Satanic Jigsaw` challenge.

Here they are sorted by order of difficulty (in my opinion):

## Selhost all the things

Now I am starting with this one because the solution in itself was simple, but the way the challenge was constructed deceived me into taking much longer than I should have:

![challenge-1](/assets/images/selhost-all.png)

So this challenge consisted of a login portal that used the discord api to login (see below) and then a chat interface.

![chall1-2](/assets/images/selfhost-all2.png)

So after fiddling a bit with the chat, I noticed it was vulnerable to XSS, and then I tried many different hacky ways to attempt to find the flag. After lots of time lots looking at this red herring. I decided to focus on the login page (above). It consisted of a checkbox html input like this:

```html
<input type="radio" name="with" value="discord" id="p-discord">
                        <label for="p-discord">discord</label>
```

Based on the hint (`discord, more like flag`), I decided to change the value of the input to `flag`: 

```html
<input type="radio" name="with" value="flag" id="p-discord">
                        <label for="p-discord">discord</label>
```

This worked and once i logged in I got the flag!

I really did kick myself once I saw how simple this time-consuming challenge was.

## Satanic Jigsaw

![chall2-1](/assets/images/satanic-jigsaw.png)

This `.7z` archive consisted of `90000`! different `.jpg` files with long integer names. With the hint( `long_to_bytes`), I had the idea of trying to change the names of all 90000 images from `longs` (large numbers) to bytes one by one with a python script:

```python
import os
from Crypto.Util.number import long_to_bytes
# listdir gets all files in directory
for filename in os.listdir("/home/uzay/Downloads/tmp/chall"):
  if filename.endswith(".jpg"):
    # converts filename without extension to bytes
    os.rename(filename, long_to_bytes(int(filename.split(".")[0])))
```

I noticed after the program, each image consisted of 2 numbers like coordinates for example: `61 125`. All these images were very small, and with the name of the problem I guessed they were each one pixel that formed an image which would give me a flag. I then used the python `Pillow` library to assemble all the images together:

```python
from PIL import Image
import os
max_width = 0
max_height = 0
# calculate max_width and height of pixel coordinates
for filename in os.listdir("/home/uzay/Downloads/tmp/chall"):
  if not filename.endswith('py'):
    max_width = max(max_width, int(filename.split(" ")[0]))
    max_height = max(max_height, int(filename.split(" ")[1]))

# initialize new image
img = Image.new('RGB', (max_width, max_height))
for filename in os.listdir("/home/uzay/Downloads/tmp/chall"):
  if not filename.endswith('py'):
    # paste the pixel at the right x and y coordinates that are stored in the filename
    img.paste(Image.open(filename), (int(filename.split(" ")[0]), int(filename.split(" ")[1])))
img.save("result.jpg")
```

This was the resulting image:

![result](https://media.discordapp.net/attachments/701353842846990346/703640070510608384/result.jpg)

All I had to do then was scan the QRs to get the flag.

## [Catography](http://challs.houseplant.riceteacatpanda.wtf:30003)

Now this one was devilish. Figuring it out was not too difficult but implementing the solution took me quite some time.

![](/assets/images/catography.png)

So the website consisted of this seemingly endless stream of cat images pulled from unsplash.  I beautified the minified js on the webpage and realised they were repeatedly pulling cat images from a local endpoint:

```js
const e = await fetch("/api?page=" + ++n),
                t = await e.json();
```

So my [teammate Aadi](https://aadibajpai.com) started looking at the images and noticed similar coordinates in the exif data for every image. We realised that we needed to gather all the cat images and put them on a map to decode the flag.

I started off by gathering all the images together with a simple ruby script and the api:

```ruby
require 'rest-client'
require 'json'
f = File.new('out.txt', 'w')
# call api 500 times to get images (500 ~= number of cat datasets)
(0..500).each do |i|
    l = JSON.parse(RestClient.get("http://challs.houseplant.riceteacatpanda.wtf:30002/api?page=#{i}"))
    # for each image in the api call store their url in text file
    l["data"].each do |image|
        f.write("http://challs.houseplant.riceteacatpanda.wtf:30002/images/#{image["id"]}.jpg\n")
    end
end
```

With this information, I then wrote a bash script to store all the exif data by downloading the images using `curl` and then exiftool for the gps coords:

```bash
#!/bin/sh
while read line; do
# send curl data to exif tool and then store only the relevant gps position data
# thanks to my teammate Nils for tips on how to process the input :)
echo $(exiftool <(curl --silent $line) | tail -n 1 | cut -d ':' -f2 | tail -c +2)$'\r' >> exif.txt
done < out.txt
```

Now that we had the coordinates, I had to put them on a map to view the result. I decided to use [LeafletJs](https://leafletjs.com/) to do this.

So the latitude longitude data of the images was stored in this format in exif: `X deg Y' Z" lat, X deg Y' Z" long` with Y being minutes and Z being seconds.

So this was the html skeleton to display the map:

```html
<head>
    <style> #map { height: 700px; width: 1400px;}</style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>
  </head>
  
  <body>
    <div id="map">
  
    </div>
  <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
  </body>

```

Now me and my teammate [diogo](https://diogos.cf) had to parse the latitudes and longitudes of each image in js (the `text` variable is all the unparsed lat / long data):

```js
// load map
var map = L.map('map').setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let parsed = text.split("\n")
parsed.forEach((item) => {
  if (item != "") {
    // split unparsed latitude and longitude
    let lat_s = item.split(",")[0].split(" ")
    let long_s = item.split(",")[1].split(" ")
    // keep in mind the format (X deg Y' Z" lat,) we split everything at " " and then we need to send the degrees, minutes, seconds and cardinal which we extract below
    let lat = ConvertDMSToDD(lat_s[0], lat_s[2].replace("'", ""), lat_s[3].replace('"', ""), lat_s[4])
    let long = ConvertDMSToDD(long_s[1], long_s[3].replace("'", ""), long_s[4].replace('"', ""), lat_s[5])
    // add extracted coords to map
    L.marker([lat, long]).addTo(map)
  }
})
// function to calculate lat and long from degrees / minutes / seconds / cardinal
function ConvertDMSToDD(degrees, minutes, seconds, cardinal) {
  var dd = parseInt(degrees) + parseInt(minutes) / 60 + parseInt(seconds) / (60 * 60);
  if (cardinal ==  "W" || cardinal == "S") dd *= -1
  return dd;
}
```

We got some weird garbled text after this code:

![](/assets/images/catography2.png)

We noticed some sort of shift in the longitude at the middle so me and diogo deduced that there must be two different strings spelled out on top of each other. 

The first half of coordinates spelled the first half of the flag backwords (`rtcp{}`) format:

![](/assets/images/catography3.png)

And then the other half gave us the end:

![](/assets/images/catography4.png)

This was a SUPER fun and satisfying challenge and the whole ctf in general was awesome. Our team tied first!!!

Comment down below if you had other strategies to complete the challenges :)

