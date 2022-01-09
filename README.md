# WOLTY-CORONA

Hello ladies and gents!

Are you also not into standing in lines not knowing if you will get a home COVID-19 test kit? [Yes]  🙋🏻🤷‍♀️

Would you also prefer to order it on wolt and be sure you will get it without standing in lines? [Yes] 🛵💨

Are you also struggeling to find a venue on wolt that sells test kits and order before they run out? [YES!]  😭

GOOD!👯‍♀️

I can't promise you'll get a test but I can help you find the open venues

### TL;DR ℹ
This will scan wolt pharmacies for an open one every 60 seconds and will let you know the list of phramacies with available COVID-19 tests around you

### Usage 🐳

Assuming you have docker running [if not - cmd+w away], do the following:

##### build the image (only needed once)
```sh
$ git clone https://github.com/D1skin/wolty-corona.git
$ cd wolty-corona
$ docker build -t wolty-corona .
```

##### scan until you find an open venue
```sh
$ docker run wolty-corona "MY_LOCATION"
```


### PIX OR IT DIDN'T HAPPEN
Here are the matching venues for my company - [Authomize](https://github.com/authomize) offices:
![image](https://user-images.githubusercontent.com/57227377/148689191-00312048-5d38-4cc4-b8cb-3184c2b69777.png)


### WAIT WHAT AND WHERE IS MOMMY
Still struggeling? me too.
See help menu by running:
```sh
$ docker run wolty-corona -h 
```


### Wanna help?
Guess you're bored too. PR at will ❤️

I would love a "send SMS" feature or a "noisy alert" feature but am too lazy to write those right now (I already got the tests for my kids)


### Credits & warnings
originally forked from https://github.com/aviadhahami/wolty 

The new code was hacked by yours truly who takes no responsiblity. The new code was half hacked on my phone and half on a computer within a bit more than an hour and is obviously half baked. For the geeks - it uses additional APIs for retail and for also uses the wolt v4 API for some stuff and I take no responsiblity to anything - use at your own risk.

### final note for the hacking minded
API leaks a lot of data, if you like hacking - it seems like a fun place to do a test (please responsibly disclose!).
