//
//  HRMPlugin.m
//  HRMPlugin
//
//  Created by Pine Wu on 7/14/13.
//
//

#import <Cordova/CDV.h>
#import "HRMPlugin.h"
#import "mytrekSDK.h"

@implementation HRMPlugin

int connState = 0;

- (void)    pluginInitialize {
    NSLog(@"Native : HRMPlugin Initializing...");
    
    hrm = [[HRMonitor alloc] init: self];
    [hrm startup];
    
    NSLog(@"Native : HRMPlugin Initialized");
}

// Get data

- (void)    GetConnectionStatus : (CDVInvokedUrlCommand *)command{
    CDVPluginResult * pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:hrm.deviceConnectionState];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)	GetHeartRate : (CDVInvokedUrlCommand *)command
{
    CDVPluginResult * pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:hrm.heartRate];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)    GetHRMData : (CDVInvokedUrlCommand *)command
{
    NSArray * myArray = [NSArray arrayWithObjects:
                         [[NSNumber numberWithFloat : hrm.heartRate] stringValue],
                         [[NSNumber numberWithInt : hrm.heartRateQuality] stringValue],
                         [[NSNumber numberWithBool: hrm.isTracking] stringValue],
                         [[NSNumber numberWithInt: hrm.batteryLevel] stringValue],
                         [[NSNumber numberWithInt: hrm.deviceConnectionState] stringValue],
                         [[NSNumber numberWithLong: hrm.elapsedTime] stringValue],
                         nil];
    
    CDVPluginResult * pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:myArray];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// Get/Set behaviour
- (void)    Startup : (CDVInvokedUrlCommand *)command
{
    [hrm startup];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)    Shutdown : (CDVInvokedUrlCommand *)command
{
    [hrm shutdown];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)    SetZone : (CDVInvokedUrlCommand *)command
{
    [hrm setZoneIndicator:[command.arguments objectAtIndex:0]];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

// Delegates to receive updates

- (void)    hrmon:(HRMonitor *)mon connectionChanged:(int)constate {
    NSLog([NSString stringWithFormat:@"Native : Connection changed to %d", constate]);
}

- (void)    hrmon:(HRMonitor *)mon batteryLevelChanged:(int)level {
    NSLog([NSString stringWithFormat:@"Native : Battery Level changed to %d", level]);
}

- (void)    hrmon:(HRMonitor *)mon buttonPressed:(uint16_t)btn {
    NSLog([NSString stringWithFormat:@"Native : Button pressed %u", btn]);
}

- (void)    hrmon:(HRMonitor *)mon displaySampleValueUpdate:(double)value {
}

- (void)    hrmon:(HRMonitor *)mon heartRateUpdate:(double)hr {
    NSLog([NSString stringWithFormat:@"Native : Heart Rate updated to : %f", hr]);
}

@end