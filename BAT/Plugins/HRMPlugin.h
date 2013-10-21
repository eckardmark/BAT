//
//  HRMPlugin.h
//  HRMPlugin
//
//  Created by Pine Wu on 7/14/13.
//
//

#import <Cordova/CDV.h>
#import "mytrekSDK.h"

@class HRMonitor;

@interface HRMPlugin : CDVPlugin<HRMonitorDelegate>
{
    HRMonitor  * hrm;
}

@end
