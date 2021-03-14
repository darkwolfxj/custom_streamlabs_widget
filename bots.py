import requests 
import threading
from time import sleep
from selenium import webdriver
from pynput.keyboard import Key, Controller
from secrets import username, password, username2, password2


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

class DLA():

    def __init__(self):
        self.browser = webdriver.Chrome()
        self.list1 = []
        self.listlen1 = 0
        self.diff1 = 0
    def login(self):
        url = "https://dlive.tv"
        self.browser.get(url)
        sleep(5)   
        self.browser.find_element_by_css_selector(".sign-in-button").click()
        confirm = input("confirm login: ")
        self.browser.get("https://dlive.tv/c/activity")
    
    def get_activity(self):
        activityfeed = self.browser.find_element_by_xpath('//*[@id="activity-list"]')
        currentlist1 = activityfeed.text.splitlines()
        currentlength1 = len(currentlist1)
        if currentlength1 > self.listlen1:
            self.diff1 = currentlength1 - self.listlen1
            self.listlen1 = currentlength1
            self.list1 = currentlist1
            r = requests.post("https://custom-streamlabs-widget-api.herokuapp.com/", json = {"update": [x + " DLive" for x in currentlist1[0:self.diff1]]} )
            print(r.json())
        else:
            sleep(3)


class TwitchActivity():
    def __init__(self):
        self.browser2 = webdriver.Chrome()
        self.list2 = []
        self.listlen2 = 0
        self.diff2 = 0

    def login(self):
        url = "https://dashboard.twitch.tv/u/haunt_is_gaming/stream-manager"
        self.browser2.get(url)   
        self.browser2.find_element_by_xpath("/html/body/div[4]/div/div/div/div/div/div[1]/div/div/div[3]/form/div/div[1]/div/div[2]/input").click()
        self.browser2.find_element_by_xpath("/html/body/div[4]/div/div/div/div/div/div[1]/div/div/div[3]/form/div/div[1]/div/div[2]/input").send_keys(username)
        self.browser2.find_element_by_xpath("/html/body/div[4]/div/div/div/div/div/div[1]/div/div/div[3]/form/div/div[2]/div/div[1]/div[2]/div[1]/input").click()
        self.browser2.find_element_by_xpath("/html/body/div[4]/div/div/div/div/div/div[1]/div/div/div[3]/form/div/div[2]/div/div[1]/div[2]/div[1]/input").send_keys(password)
        self.browser2.find_element_by_xpath("/html/body/div[4]/div/div/div/div/div/div[1]/div/div/div[3]/form/div/div[3]/button/div/div").click()
        confirm = input("confirm login: ")
        print("logged in")
    def get_activity(self):
        activityfeed = self.browser2.find_element_by_css_selector('.activity-list-layout')
        currentlist2 = activityfeed.text.splitlines()
        currentlength2 = len(currentlist2)
        if currentlength2 > self.listlen2:
            self.diff2 = currentlength2 - self.listlen2
            self.listlen2 = currentlength2
            self.list2 = currentlist2
            r2 = requests.post("https://custom-streamlabs-widget-api.herokuapp.com/", json = {"update": [x + " Twitch" for x in currentlist2[0:self.diff2+1]]} )
            print(r2.json())
        else:
            sleep(3)
twitch = TwitchActivity()
twitch.login()
confirm = input("Turn off raids! ")
set_interval(twitch.get_activity, 1)
dlive = DLA()
dlive.login()
sleep(3)
set_interval(dlive.get_activity, 1)
def refresh():
    twitch.list2 = []
    twitch.listlen2 = 0
    twitch.diff2 = 0
    twitch.get_activity()
    dlive.list1 = []
    dlive.listlen1 = 0
    dlive.diff1 = 0
    dlive.get_activity()
    