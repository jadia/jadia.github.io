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

I have a habit of putting my ultrabook on bed (vents are blocked) because the fans rarely start. But when it does I make sure to give enough room for fans to work.

Below is a script I made to get notification on Ubuntu when fan starts. The script checks the fan status every few seconds and notifies the user if fan is running and goes to sleep for 5min.

```bash

pip install psutil

```


```python

#!/usr/bin/env python3

import psutil
import os
from time import sleep
import logging
import datetime as dt

## Logging

logfile_name = dt.datetime.now().strftime('fan_status_%Y_%m_%d.log')
path = '/home/nitish/cron'
logfile_path = os.path.join(path,'logs',logfile_name)

logging.basicConfig(filename=logfile_path,
                            filemode='a',
                            format='%(pathname)s, %(asctime)s, %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.DEBUG)

log = logging.getLogger('fan_speed')


log.info("Process started.")
fan_running = False
try:
    while True:
        fan_speed = psutil.sensors_fans()['dell_smm'][0][1] # output: {'dell_smm': [sfan(label='', current=0)]}
        log.debug(f'fan_speed: {fan_speed}')
        if fan_speed != 0 and not fan_running:
            log.info("Fan started running! Sleeping for 5min.")
            cmd = f'notify-send "Fan started! {fan_speed} RPM" -t 20000 -u critical'
            fan_running = True
            sleep_time = 300 # seconds
        elif fan_speed != 0 and fan_running:
            log.info("Fan still running! Sleeping for 5min.")
            cmd = f'notify-send "Fan speed: {fan_speed} RPM" -t 10000 -u normal'
            sleep_time = 300
        else:
            if fan_running:
                cmd = 'notify-send "Fan stopped!" -t 20000 -u low'
                fan_running = False
            else:
                cmd = None
            # log.info("Fan not running")
            sleep_time = 15
        if cmd:
            os.system(cmd)
        sleep(sleep_time)
except Exception as e:
    log.exception("Something went wrong.")

```

But this script won't be able to show the notification because of how `notify-send` works.

If you are using Ubuntu 20.04(Gnome) in GUI mode then you can go to **Start up applications** and add your script over there.

Since, I'm using i3wm (another window manager) I had to find a workaround for the script to run in `crontab`.

Adding **target DISPLAY** to crontab helps. 

```bash

#Check the value of DISPLAY var
echo $DISPLAY
# output: :0
crontab -e

```

So I will add the following lines in the crontab.

```vim

DISPLAY=:0
@reboot bash -c "/home/nitish/cron/fan_status.py"

```

Cheers! :beers: