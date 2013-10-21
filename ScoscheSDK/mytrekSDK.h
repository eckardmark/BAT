#define BTN_CENTER_1X		0x210
#define BTN_CENTER_2X		0x230
#define BTN_CENTER_3X		0x250
#define BTN_MINUS_1X		0x110
#define BTN_MINUS_2X		0x130
#define BTN_MINUS_3X		0x150
#define BTN_PLUS_1X			0x010
#define BTN_PLUS_2X			0x030
#define BTN_PLUS_3X			0x050
#define BTN_CENTER_HOLD2	0x20b

@class HRMonitor;

enum {
	CONSTATE_DISCONNECTED=0,				/* HR Monitor is disconnected */
	CONSTATE_CONNECTED,						/* HR Monitor is connected */
	CONSTATE_CONNECTED_NO_DATA,				/* HR Monitor is connected, but there is no data from the unit -> bad BT connection */
	CONSTATE_DISCONNECTING_POWER_LOW,		/* HR Monitor is disconnecting because of low power */
	CONSTATE_DISCONNECTING_POWER_OFF,		/* HR Monitor is disconnecting because of hardware power down button being held down */ 
	CONSTATE_DISCONNECTED_POWER_LOW,		/* HR Monitor disconnected because of low battery power */
	CONSTATE_DISCONNECTED_POWER_OFF			/* HR Monitor disconnected because of hardware power down button */
};

enum {
	ZONE_OFF = 0,	/* LEDS OFF */
	ZONE_LOW = 1,	/* GREEN FAST BLINKING */
	ZONE_MID = 2,	/* GREEN SLOW BLINKING */
	ZONE_HI = 3		/* RED FAST BLINKING */
};

@protocol HRMonitorDelegate
- (void) hrmon: (HRMonitor*) mon buttonPressed:				(uint16_t)	btn;		/* button press from HR monitor, codes see BTN_XXX table above */
- (void) hrmon: (HRMonitor*) mon batteryLevelChanged:		(int)		level;		/* battery level in % changed, returns -1 when battery is empty and unit will disconnect */
- (void) hrmon: (HRMonitor*) mon displaySampleValueUpdate:	(double)	value;		/* returns waveform data to display pulsating graph, app needs to scale according to min/max values */
- (void) hrmon: (HRMonitor*) mon heartRateUpdate:			(double)	hr;			/* returns heart rate update every second */
- (void) hrmon: (HRMonitor*) mon connectionChanged:			(int)		constate;	/* returns connection state, see CONNSTATE_XX */
@end


@interface HRMonitor : NSObject <NSStreamDelegate>{

}

-(id) init: (id) _delegate;
-(void)startup;
-(void)shutdown;
-(void)setZoneIndicator: (int) zone;						/* set led indicators for HR zone */

-(void)setSimulationArray: (NSArray*) data;					/* set an array of dictionaries that hold simulation entries */
-(void) startSimulation;									/* start virtual device simulation */
-(void) stopSimulation;										/* stop virtual device simulation */

/*
 Simulation data entries:
 
 [NSNumber numberWithFloat:1.0],@"delay",						the delay until this step will execute
 [NSNumber numberWithFloat:30.0],@"hr",							heart rate
 [NSNumber numberWithInt: 50],@"hrq",							heart rate quality
 [NSNumber numberWithBool:true],@"trk"							tracking indicator
 [NSNumber numberWithInt:CONSTATE_DISCONNECTED],@"constate",	connection state
 [NSNumber numberWithInt:50],@"blvl",							battery level
 [NSNumber numberWithBool:true],@"hwcon",						hardware connection
 [NSNumber numberWithInt:BTN_CENTER_1X],@"btn"					button code

 */


@property(readonly) float			heartRate;				/* actual heart rate */
@property(readonly) int				heartRateQuality;		/* heart rate measurement quality in % */
@property(readonly) BOOL			isTracking;				/* information if unit is tracking the pulse, if NO, unit is off skin or signal is very bad */
@property(readonly) int				batteryLevel;			/* battery level in % */
@property(readonly) int				deviceConnectionState;	/* connection state */
@property(assign) id				delegate;				/* delegate to receive updates */
@property(readonly) long			elapsedTime;			/* time elapsed since last connection of HR monitor */
@end
