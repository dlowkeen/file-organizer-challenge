import { EventEmitter } from 'events';

class Logger {
	// private logger: EventEmitter | undefined;

    /**
     * Pass event emitter into logger class. Would like to make this where we use the eventEmitter's logging methods in
     * the trace and error methods from this class. For now, just console logging things.
     * @param eventEmitter In the future, we could add a service like appInsights, loggly, etc as the eventEmitter.
     */
	private constructor(eventEmitter?: EventEmitter) {
		// this.logger = eventEmitter;
	}

	public static create() {
		return new Logger();
	}

	public trace(customMsg: any) {
		console.log(customMsg);
	}

	public error(customMsg: string, e: Error) {
		const msg = {
			customMsg: customMsg,
			error: JSON.stringify(e),
		};
		console.log('ERROR: ' + JSON.stringify(msg));
	}
}

// export instance of logger for singleton pattern
const logger = Logger.create();
export default logger;
