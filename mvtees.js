/**
 * MVTees.js split testing libarary.
 *
 * @package MVTees
 */

'use strict';

/**
 * ES6 class to hold the test library.
 */
class MVTees {

	// constructor to do instasiate tasks (this).
	constructor( name, debug ) {

		// Set some base properties of the class.
		// A name, a tests array and debug flag.
		this.name = name || 'mvtees';
		this.tests = [];
		// debug toggle.
		this.debug = debug || false;

		// Determine if this user is already got an ID.
		this.user = this.get_user_id();

	}

	/**
	 * Either gets or sets the current users unique ID.
	 *
	 * @return {string} a string with a guid.
	 */
	get_user_id() {
		let id = this.get_local_storage( 'uuid' );
		if ( ! id ) {
			id = MVTees.generate_uuidv4();
			console.log( id );
			this.set_local_storage( 'uuid', id.toString() );
		}
		return id;
	}

	/**
	 * Tests if this user is already in this test and as such should recieve
	 * the same varient each request.
	 *
	 * @param {String} [testname=''] a string containing the testname being performed.
	 * @return {Boolean}             will return either the test varient if user is in it or null if not.
	 */
	is_user_in_test( testname = '' ) {
		if ( testname ) {
			// return the keyname, will be null on fail.
			return this.get_local_storage( this.user + '-' + testname );
		}
	}

	/**
	 * Returns a test when requested by name.
	 *
	 * @param {String} [name=''] the name of a test to return.
	 * @return {Object}          a test object for the library.
	 */
	get_test_by_name( name = '' ){
		// if we got passed a name.
		if ( name ) {
			/**
			 * Loop through all test objects testing names and return the
			 * first match.
			 */
			let length = this.tests.length;
			for ( let i = 0; i < length; i++ ) {
				if ( this.tests[i].name === name ) {
					return this.tests[i];
				}
			}
		}
	}

	/**
	 * Function to grab the tests (or a single test) from the object.
	 *
	 * @param  {mixed}  [test_id=false] an integer of a test if we want one.
	 * @return {mixed}                  false if no tests, test item or array of them otherwise.
	 */
	get_tests( test_id = false ) {
		// debug block.
		if ( this.debug ) {
			console.log( 'get_tests: testid=' + test_id );
		}
		/**
		 * Can be either a single test object or multiple, decide which
		 * we're getting then return it.
		 */
		var result;
		if ( test_id || 0 === test_id ) {
			result = this.tests[ test_id ];
		} else {
			result = this.tests;
		}
		return result;
	}

	/**
	 * Helper function to set some values to local storage.
	 *
	 * @param {string} key the key we'll save to local storage with.
	 * @param {mixed}  obj the data we're putting into local storage.
	 */
	set_local_storage( key, obj ) {
		var storage = window.localStorage;
		storage.setItem( this.name + '-' + key, JSON.stringify( obj, null, 4 ) );
	}

	/**
	 * Helper function to get values from local storage.
	 *
	 * @param {string} key the key we want to get data for.
	 * @return {mixed}     maybe return the data from local storage.
	 */
	get_local_storage( key ) {
		var storage = window.localStorage;
		if ( storage ) {
			let value = JSON.parse( storage.getItem( this.name + '-' + key ) );
			return value;
		} else {
			// debug block.
			if ( this.debug ) {
				console.log( 'Error! Local Storage not available.' );
			}
		}
	}

	/**
	 * Convenience method to perform tests at creation.
	 *
	 * @param {object} test should be a test object.
	 */
	do_test( test ){
		this._run_test( test );
	}

	/**
	 * Adds a test object to the tests array of the class.
	 *
	 * @param {object} test a test object to maybe add.
	 * @return {mixed}       returns false on failuire null on success.
	 */
	add_test( test ){
		if ( this.debug ) {
			console.log( test );
		}
		// test that we have the required values.
		if ( test.name === null ) {
			console.log( 'No name was passed when adding a test.' );
			return false;
		}
		if ( test.data === null ) {
			console.log( 'No test data was passed when adding a test.' );
			return false;
		}
		this.tests.push( test )
	}

	/**
	 * Loops through all the tests array and triggers each test to run.
	 */
	run_tests(){
		let length = this.tests.length;
		for ( let i = 0; i < length; i++ ) {
			let test = this.tests[i];
			if ( this.debug ) {
				console.log( test );
			}
			this._run_test( test );
		}
	}

	/**
	 * This is the actual test runner function. It runs the vorrect varient for
	 * the given user based on previous selection - or it does the selection.
	 *
	 * @param {object} test a test object to run.
	 * @return {[type]}
	 */
	_run_test( test ) {
		// make sure we got a test passed.
		if ( test ) {
			let keynum = 0;
			// if the test has varients...
			if ( test.varients ) {
				// if the user is already in test this should return a keyname.
				let keyname = this.is_user_in_test( test.name );

				// If the user wasn't in test already... pick a varient for them.
				if ( ! keyname ) {

					if ( Object.keys( test.varients ).length > 1 ) {
						keynum = Math.floor( Math.random() * ( Object.keys( test.varients ).length ) );
					}

					// this will be the varient keyname we are using.
					keyname = Object.keys( test.varients )[keynum];
					// varient has been chosen for this user.
					this.set_local_storage( this.user + '-' + test.name, keyname );
				}

				if ( this.debug ) {
					console.log( keyname );
					console.log( test.varients[ keyname ] );
				}
				test.varients[keyname].onChosen();
			}
		}
	}

	/**
	 * This function is just to mock adding of tests and is used in dev only.
	 */
	dev_mock_tests() {
		this.tests.push({
			name: 'test1',
			data: 'first',
			varients: {
				test1_1: {
					onChosen: function() {
						console.log( 'test1_1 was chosen' );
					}
				},
				test1_2: {
					onChosen: function() {
						console.log( 'test1_2 was chosen' );
					}
				}
			}
		});

		this.tests.push({
			name: 'test2',
			data: 'second',
			varients: {
				test2_1: {
					onChosen: function() {
						console.log( 'test2_1 was chosen' );
					}
				},
				test2_2: {
					onChosen: function() {
						console.log( 'test2_2 was chosen' );
					}
				}
			}
		});

		this.tests.push({
			name: 'test3',
			varients: {
				var1: {
					test_type: 'basic',
					onChosen: function() {
						console.log( 'var1 was chosen' );
					}
				},
				var2: {
					onChosen: function() {
						console.log( 'var2 was chosen' );
					}
				}
			}
		});

	}

	/**
	 * Generate a valid uuid for users.
	 *
	 * Inspiration for this entire function was found at the link.
	 *
	 * @link https://gist.github.com/jed/982883
	 *
	 * @return {string} a valid uuidv4
	 */
	static generate_uuidv4() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues( new Uint8Array( 1 ) )[0] & 15 >> c / 4).toString( 16 )
		)
	}

}
