---
layout: post
title: Get notification when laptop fan turns on
date: 2020-12-15 21:20 +0530
description: 
tags: ["Python"]
image:
  path: "/assets/social-devops-python-preview.png"
  width: 1200
  height: 628
twitter:
  card: summary_large_image
---

I have a habit of putting my ultrabook on bed (vents are blocked) because the fans rarly start. But when it does I make sure to give enough room for fans to work.

Below is a script I made to get notification on Ubuntu when fan starts. It requires `psutil` to be installed.


```python
#!/usr/bin/env python3

import psutil
import os
from time import sleep
import signal
import sys

def signal_handler(signal, frame):
  sys.exit(0)

# Handle Ctrl+c
signal.signal(signal.SIGINT, signal_handler)


fan_running = False

while True:
    fan_speed = psutil.sensors_fans()['dell_smm'][0][1] # output: {'dell_smm': [sfan(label='', current=0)]}
    print(fan_speed)
    if fan_speed != 0 and not fan_running:
        print("Fan started running! Sleeping for 5min.")
        cmd = 'notify-send "Fan started!"'
        fan_running = True
        sleep_time = 300 # seconds
    elif fan_speed != 0 and fan_running:
        print("Fan still running! Sleeping for 5min.")
        cmd = f'notify-send "Fan speed: {fan_speed} RPM"'
        sleep_time = 300
    else:
        if fan_running:
            cmd = 'notify-send "Fan stopped!"'
            fan_running = False
        else:
            cmd = None
        print("Fan not running")
        sleep_time = 60
    if cmd:
        os.system(cmd)
    sleep(sleep_time)
    ```