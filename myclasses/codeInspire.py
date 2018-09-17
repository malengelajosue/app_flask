#!/usr/bin/env python

import sys
import serial


try:
    ser = serial.Serial()
    ser.baudrate = 4800
    ser.port = '/dev/ttyUSB0'

    ser.open()

    if not ser.isOpen():
        print("Unable to open serial port!")
    else:
        print("Connection etablie")
except serial.serialutil.SerialException:
    print("Unable to open serial port!")

