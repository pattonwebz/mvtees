'use strict';

/**
 * ES6 class to hold the test library.
 */
class MVTees {
	// constructor to do instasiate tasks (this).
	constructor( name, debug ) {
		// set.
		this.name = name || 'MVTees';
		this.tests = [];

		// debug toggle.
		this.debug = debug || false;

		// this is only present in dev.
		this.dev_mock_tests();

	}

	/**
	 * Functino to grab the tests (or a single test) from the object.
	 *
	 * @param  {mixed}  [test_id=false] an integer of a test if we want one.
	 * @return {mixed}                  false if no tests, test item or array of them otherwise.
	 */
	get_tests( test_id = false ) {
		// debug block.
		if ( this.debug ) {
			console.log( 'get_tests: testid=' + test_id );
		}
		// return either a single test object or multiple.
		var result;
		if ( test_id || 0 === test_id ) {
			result = this.tests[ test_id ];
		} else {
			result = this.tests;
		}
		return result;
	}

	set_local_storage( key, obj ) {
		var storage = window.localStorage;
		storage.setItem( this.name + '-' + key, JSON.stringify( obj, null, 4 ) );
	}

	get_local_storage( key ) {
		var storage = window.localStorage;
		if ( storage ) {
			let value = storage.getItem( this.name + '-' + key );
			return value;
		} else {
			// debug block.
			if ( this.debug ) {
				console.log( 'Error! Local Storage not available.' );
			}
		}
	}

	do_test( test ){
		this.add_test( test );

		this.run_tests();
	}

	add_test( test ){
		this.tests.push( test )
		this.set_local_storage( test.name, test );
	}

	run_tests(){
		// WIP: this just loops and logs messages that have been saved to local storage.
		let length = this.tests.length;
		for (let i = 0; i < length; i++) {
			let obj = this.get_local_storage( this.tests[i].name );
			console.log( obj );
		}
	}

	dev_mock_tests() {
		this.tests.push({
			name: 'test1',
			data: 'first'
		});
		this.set_local_storage( this.tests[0].name, this.tests[0] )
		this.tests.push({
			name: 'test2',
			data: 'second'
		});
		this.set_local_storage( this.tests[1].name, this.tests[1] )
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
