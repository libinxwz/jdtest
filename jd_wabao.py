#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''
cron: 30 0,15 * * *
new Env('发财挖宝');
活动入口：京东极速版>我的>发财挖宝
脚本功能为:玩一玩得1血，内部互助，挖宝，提现
由于每个号只有两次助力机会，所以只助力前两个助力码
当血量剩余 1 时停止挖宝，领取奖励并提现
环境变量：JD_COOKIE，wabao_spring
export JD_COOKIE="第1个cookie&第2个cookie"
export wabao_spring="是否自动领取奖励并提现微信红包，yes或no,不填则默认yes领取奖励并提现微信红包"
11 13 12:00 添加玩一玩任务，更新linkId
'''
import os,json,random,time,re,string,functools,asyncio
import sys
sys.path.append('../../tmp')
try:
    import requests
except Exception as e:
    print(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")
requests.packages.urllib3.disable_warnings()


run_send='yes'          # yes或no, yes则启用通知推送服务
wabao_spring='yes'      # 是否自动领取奖励并提现,环境变量优先于脚本内部变量
linkId="pTTvJeSTrpthgk9ASBVGsw"


# 获取pin
cookie_findall=re.compile(r'pt_pin=(.+?);')
def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        print('ck格式不正确，请检查')

# 读取环境变量
def get_env(env):
    try:
        if env in os.environ:
            a=os.environ[env]
        elif '/ql' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/ql/config/config.sh')
            except:
                a=eval(env)
        elif '/jd' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/jd/config/config.sh')
            except:
                a=eval(env)
        else:
            a=eval(env)
    except:
        a=''
    return a

# v4
def v4_env(env,paths):
    b=re.compile(r'(?:export )?'+env+r' ?= ?[\"\'](.*?)[\"\']', re.I)
    with open(paths, 'r') as f:
        for line in f.readlines():
            try:
                c=b.match(line).group(1)
                break
            except:
                pass
    return c 


# 随机ua
def ua():
    sys.path.append(os.path.abspath('.'))
    try:
        from jdEnv import USER_AGENTS as a
    except:
        a='jdpingou;android;5.5.0;11;network/wifi;model/M2102K1C;appBuild/18299;partner/lcjx11;session/110;pap/JA2019_3111789;brand/Xiaomi;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36'
    return a

# 13位时间戳
def gettimestamp():
    return str(int(time.time() * 1000))

## 获取cooie
class Judge_env(object):
    def main_run(self):
        if '/jd' in os.path.abspath(os.path.dirname(__file__)):
            cookie_list=self.v4_cookie()
        else:
            cookie_list=os.environ["JD_COOKIE"].split('&')       # 获取cookie_list的合集
        if len(cookie_list)<1:
            msg('请填写环境变量JD_COOKIE\n')    
        return cookie_list

    def v4_cookie(self):
        a=[]
        b=re.compile(r'Cookie'+'.*?=\"(.*?)\"', re.I)
        with open('/jd/config/config.sh', 'r') as f:
            for line in f.readlines():
                try:
                    regular=b.match(line).group(1)
                    a.append(regular)
                except:
                    pass
        return a
cookie_list=Judge_env().main_run()


## 获取通知服务
class Msg(object):
    def getsendNotify(self, a=1):
        try:
            url = 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/wuye999/myScripts/main/sendNotify.py'
            response = requests.get(url,timeout=3)
            with open('sendNotify.py', "w+", encoding="utf-8") as f:
                f.write(response.text)
            return
        except:
            pass
        if a < 5:
            a += 1
            return self.getsendNotify(a)

    def main(self,f=1):
        global send,msg,initialize
        sys.path.append(os.path.abspath('.'))
        for n in range(3):
            try:
                from sendNotify import send,msg,initialize
                break
            except:
                self.getsendNotify()
        l=['BARK','SCKEY','TG_BOT_TOKEN','TG_USER_ID','TG_API_HOST','TG_PROXY_HOST','TG_PROXY_PORT','DD_BOT_TOKEN','DD_BOT_SECRET','Q_SKEY','QQ_MODE','QYWX_AM','PUSH_PLUS_TOKEN','PUSH_PLUS_USER']
        d={}
        for a in l:
            try:
                d[a]=eval(a)
            except:
                d[a]=''
        try:
            initialize(d)
        except:
            self.getsendNotify()
            if f < 5:
                f += 1
                return self.main(f)
            else:
                print('获取通知服务失败，请检查网络连接...')
Msg().main()   # 初始化通知服务    


def taskGetUrl(functionId, body, cookie):
    url=f'https://api.m.jd.com/?functionId={functionId}&body={json.dumps(body)}&t={gettimestamp()}&appid=activities_platform&client=H5&clientVersion=1.0.0'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json, text/plain, */*',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    for n in range(3):
        try:
            res=requests.get(url,headers=headers).json()
            return res
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n')   


# 开局验证？
def activity(cookie):
    url="https://h5speed.m.jd.com/v2/speed/activity?flag=132&sid=f77337204fa0b3cdbc02fa03b6cfb45w&libVer=2.0.0&url=https%3A%2F%2Fbnzf.jd.com%2F&rts=1635613363462&title=%E5%8F%91%E8%B4%A2%E6%8C%96%E5%AE%9D&p1=1&p2=1&p3=1&p4=0&p5=0&p6=10&p7=249&p8=107&p9=7&p10=114&p11=1751&p12=1751&p13=0&p14=1893&p15=377&p16=1516&resources={%22badjs.json?Content=%20%5B%20Sun%20Oct%2031%202021%2001%3A02%3A39%20GMT%2B0800%20(%E5%8C%97%E7%BE%8E%E4%B8%AD%E9%83%A8%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%20%5D%20configCenterAjaxPrame%20Exception&referer=https%3A%2F%2Fimk2.jd.com%2Fauto%2Fopen%2Fliteapp%2FconfigCenter%2Fajax%2Fsuccess%2Fexception%3Fwq&t=0.6081273460492731%22:397,%22preArousal?app=jdliteapp&refer=https%3A%2F%2Fbnzf.jd.com%2F%3FactivityId%3D"+linkId+"%26lng%3D107.648869%26lat%3D30.281194%26sid%3Df77337204fa0b3cdbc02fa03b6cfb45w%26un_area%3D4_134_19915_0&imkUserId=imk2291.330737368482&type=1&msg=configCenterAjaxPrame%20Exception&t=0.1307983996705202%22:407,%22api-getStaticResource%22:392,%22api-apTaskList%22:394,%22api-getStationMarquees%22:373,%22api-happyDigHome%22:432,%22blast.cfc8150d.gif%22:365,%22halo.6d8599b2.gif%22:370,%22crack.0f00e203.gif%22:374,%22exception?data=eyJmbGFnIjoxMzIsInJ0cyI6MTYzNTYxMzM2MDUxMCwibGliVmVyIjoiMi4xLjUiLCJ1cmwiOiJodHRwczovL2JuemYuamQuY29tLyIsInRpdGxlIjoi5Y%2BR6LSi5oyW5a6dIiwiZXJyVHlwZSI6NCwiZXJyQ29kZSI6NzUwLCJlcnJNc2ciOiJKRFBlcmZvcm1hbmNlLnNlbmRSZXNvdXJjZSBpcyBub3QgYSBmdW5jdGlvbiIsImV4Y2VwdGlvbkluZm8iOnsidHlwZSI6IlR5cGVFcnJvciIsInN0YWNrIjpbXX19%22:418,%22eff9a57761a0c45a.png%22:111,%22bbbee650e29a8525.png%22:190,%22hand.1e279b77.gif%22:153,%226e3d0e3f0efa29d3.jpg%22:532,%220af3dbd3ab14a953.jpg%22:695}"
    headers={
        'Cookie': cookie,
        'Host': 'h5speed.m.jd.com',
        'Connection': 'keep-alive',
        'referer': f'https://bnzf.jd.com/?activityId={linkId}&lng=107.648869&lat=30.281194&sid=f77337204fa0b3cdbc02fa03b6cfb45w&un_area=4_134_19915_0',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    } 
    for n in range(3):
        try:
            requests.post(url,headers=headers,data=data).json()
            return res
        except:
            if n==3:
                msg('API请求失败，请检查网路重试❗\n')   



# 剩余血量
def xueliang(cookie):
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            return blood      

def jinge(cookie,i):
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            roundList=res['data']['roundList']                      # 3个总池子
            roundList_n=roundList[0]
            redAmount=roundList_n['redAmount']                  # 当前池已得京东红包
            cashAmount=roundList_n['cashAmount']                # 当前池已得微信红包

            return [blood,redAmount,cashAmount]   

# 页面数据
def happyDigHome(cookie):
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            roundList=res['data']['roundList']                      # 3个总池子
            for roundList_n in roundList:                           # 迭代每个池子
                roundid=roundList_n['round']                        # 池序号
                state=roundList_n['state'] 
                rows=roundList_n['rows']                            # 池规模，rows*rows
                redAmount=roundList_n['redAmount']                  # 当前池已得京东红包
                cashAmount=roundList_n['cashAmount']                # 当前池已得微信红包
                leftAmount=roundList_n['leftAmount']                # 剩余红包？
                chunks=roundList_n['chunks']                        # 当前池详情list

                a=jinge(cookie,roundid)
                msg(f'当前池序号为 {roundid} \n当前池规模为 {rows}*{rows}')
                msg(f'剩余血量 {a[0]}')
                msg(f'当前池已得京东红包 {a[2]}\n当前池已得微信红包 {a[1]}\n')
       
                if (_blood:=xueliang(cookie))>1:
                    happyDigDo(cookie,roundid,0,0)
                    for n in range(roundid+4):
                        for i in range(roundid+4):
                            if (_blood:=xueliang(cookie))>1:
                                msg(f'当前血量为 {_blood} 健康，继续挖宝')
                                msg(f'本次挖取坐标为 ({n},{i})')
                                happyDigDo(cookie,roundid,n,i)
                                
                            else:
                                a=jinge(cookie,roundid)
                                msg(f'当前血量为 {_blood} 不健康，结束该池挖宝')
                                msg(f'当前池已得京东红包 {a[2]}\n当前池已得微信红包 {a[1]}\n')
                                break
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')


# 玩一玩
def apDoTask(cookie):
    msg('开始 玩一玩')
    body={"linkId":linkId,"taskType":"BROWSE_CHANNEL","taskId":454,"channel":4,"itemId":"https%3A%2F%2Fsignfree.jd.com%2F%3FactivityId%3DPiuLvM8vamONsWzC0wqBGQ","checkVersion":False}
    res=taskGetUrl('apDoTask', body, cookie)
    if not res:
        return
    try:    
        if res['success']:
            msg('任务完成，获得血量 1\n')
        else:
            msg(f"{res['errMsg']}\n")
    except:
        msg(f"错误\n{res}\n")
    

# 挖宝
def happyDigDo(cookie,roundid,rowIdx,colIdx):
    body={"round":roundid,"rowIdx":rowIdx,"colIdx":colIdx,"linkId":linkId}
    res=taskGetUrl("happyDigDo", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            typeid=res['data']['chunk']['type']
            if typeid==2:
                msg(f"挖到京东红包 {res['data']['chunk']['value']}\n")
            elif typeid==3:
                msg(f"挖到微信红包 {res['data']['chunk']['value']}\n")
            elif typeid==4:
                msg(f"挖到炸弹\n")
            elif typeid==1:
                msg(f"挖到优惠券\n")
            else:
                msg(f'挖到外星物品\n')
        else:
            msg(f'挖取失败\n{res}\n')
    else:
        msg(f'挖取失败\n{res}\n')

# 助力码
def inviteCode(cookie):
    global inviteCode_1_list,inviteCode_2_list
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    try:
        if res['success']:
            msg(f"账号{get_pin(cookie)}助力码为{res['data']['inviteCode']}")
            inviteCode_1_list.append(res['data']['inviteCode'])
            msg(f"账号{get_pin(cookie)}助力码为{res['data']['markedPin']}")
            inviteCode_2_list.append(res['data']['markedPin'])
        else:
            msg('快去买买买吧')
    except:
        msg(f"错误\n{res}\n")

# 助力
def happyDigHelp(cookie,fcwbinviter,fcwbinviteCode):
    msg(f"账号 {get_pin(cookie)} 去助力{fcwbinviteCode}")
    xueliang(cookie)
    body={"linkId":linkId,"inviter":fcwbinviter,"inviteCode":fcwbinviteCode}
    res=taskGetUrl("happyDigHelp", body, cookie)
    if res['success']:
        msg('助力成功')
    else:
        msg(res['errMsg'])

# 领取奖励
def happyDigExchange(cookie):
    for n in range(0,4):
        xueliang(cookie)
        
        msg('开始领取奖励')
        body={"round":n,"linkId":linkId}
        res=taskGetUrl("happyDigExchange", body, cookie)
        if not res:
            return
        if res['code']==0:
            if res['success']:
                try:
                    msg(f"领取到微信红包 {res['data']['wxValue']}")
                except:
                    pass
                try:
                    msg(f"领取到京东红包 {res['data']['redValue']}\n")
                except:
                    msg('')
            else:
                msg(res['errMsg']+'\n')
        else:
            msg(res['errMsg']+'\n')



# 微信现金id
def spring_reward_list(cookie):
    happyDigExchange(cookie)
    xueliang(cookie)
    
    body={"linkId":linkId,"pageNum":1,"pageSize":5}
    res=taskGetUrl("spring_reward_list", body, cookie)
    
    if res['code']==0:
        if res['success']:
            items=res['data']['items']
            for _items in items:
                amount=_items['amount']         # 金额
                prizeDesc=_items['prizeDesc']   # 金额备注
                amountid=_items['id']           # 金额id
                poolBaseId=_items['poolBaseId']
                prizeGroupId=_items['prizeGroupId']
                prizeBaseId=_items['prizeBaseId']
                if '极速版签到返红包' not in prizeDesc:
                    msg('尝试微信提现')
                    wecat(cookie,amountid,poolBaseId,prizeGroupId,prizeBaseId)
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')                     

# 微信提现
def wecat(cookie,amountid,poolBaseId,prizeGroupId,prizeBaseId):
    xueliang(cookie)
    
    url='https://api.m.jd.com'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    body={"businessSource":"happyDiggerH5Cash","base":{"id":amountid,"business":"happyDigger","poolBaseId":poolBaseId,"prizeGroupId":prizeGroupId,"prizeBaseId":prizeBaseId,"prizeType":4},"linkId":linkId}
    data=f"functionId=apCashWithDraw&body={json.dumps(body)}&t=1635596380119&appid=activities_platform&client=H5&clientVersion=1.0.0"
    for n in range(3):
        try:
            res=requests.post(url,headers=headers,data=data).json()
            break
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n') 
    try:
        if res['code']==0:
            if res['success']:
                msg(res['data']['message']+'\n')
    except:
        msg(res)
        msg('')
    

def main():
    msg('🔔发财挖宝，开始！\n')

    msg('获取助力码\n')
    global inviteCode_1_list,inviteCode_2_list
    inviteCode_1_list=list()
    inviteCode_2_list=list()
    for cookie in cookie_list:
       inviteCode(cookie) 

    msg('互助\n')
    inviteCode_2_list=inviteCode_2_list[:2]
    for e,fcwbinviter in enumerate(inviteCode_2_list):
        fcwbinviteCode=inviteCode_1_list[e]
        for cookie in cookie_list:
            happyDigHelp(cookie,fcwbinviter,fcwbinviteCode)

    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')

    tasksss=[]
    for e,cookie in enumerate(cookie_list,start=1):
        msg(f'******开始【账号 {e}】 {get_pin(cookie)} *********\n')
        activity(cookie)
        apDoTask(cookie)
        happyDigHome(cookie)
        if get_env('wabao_spring')=='yes':
            spring_reward_list(cookie)
        
    msg('作者：wuye9999\n')
    msg('地址:https://github.com/wuye999/myScripts')

    if run_send=='yes':
        send('### 发财挖宝 ###')   # 通知服务


if __name__ == '__main__':
    main()