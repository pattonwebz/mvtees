# mvtees

___'This library may be in an incomplete or a non-functional state. Production use is not encouraged.'___

This library can be used to set-up and run multivariate tests (MVTs - sometimes called `Split Testing` or `A/B Testing`) on the contents of any html page where the user supports JavaScript. There are no external dependancies and it uses localStorage for client-side data.

The script handles the 4 main points of running successful MVTs:

- Provides a way to define tests and variants.
- Exposes a method to set the sample size for each test.
- Handle consistency between visits for individual users.
- Allows tracking and storing of the data for use in any analytics platform you choose.

## Using the Framework and Running Tests

Include the framework inside your page:

`<script src="mvtees.js"></script>`

Then instantiate the `MVTees` class and run a test with some variants.

```JavaScript
// instantiate the main class.
let mvtees = new MVTees();

// add a test with 3 variants. These tests change some text in the page and
// the 3rd also updates the css `color` property of the element.
mvtees.do_test({
	name: 'test1',
	sample: 0.5,
	varients: {
		test1_1: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'text';
			},
		},
		test1_2: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'code';
			}
		},
		test1_3: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'third';
				el.style.color = 'red';
			}
		}
	}
});
```

The `do_test` method will run the test specified immediately as it executes. There is also a queue that you can add your test (or several tests) to and trigger the run of them yourself.

```JavaScript
// instantiate the main class.
let mvtees = new MVTees();

// add a test with 3 variants. These tests change some text in the page and
// the 3rd also updates the css `color` property of the element.
mvtees.add_test({
	name: 'test1',
	sample: 0.5,
	varients: {
		test1_1: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'text';
			},
		},
		test1_2: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'code';
			}
		},
		test1_3: {
			onChosen: function() {
				let el = document.getElementById('testelement');
				el.innerHTML = 'third';
				el.style.color = 'red';
			}
		}
	}
})

/**
 * NOTE: You could add additional tests here.
 */

// run all tests in the queue. You can trigger this at a later point. Maybe
// inside of a doc ready block if you are using jQuery.
mvtees.run_tests();
```

## Defining Tests and Variants

A test object consists of a few properties and should contain 2 or more varient objects.

- `name` - This is the name used to identify the test. __REQUIRED__.
- `varients` - The test varients. __REQUIRED__
- `sample` - This is a single value representing a percentage of visitors to include in the test. Example: 0.5 = 50%. __DEFAULT:__ 1
- `storageAdapter` - This is the adaptor used to handle tracking of test run and conversions. __DEFAULT:__ Event Tracking through Google Universal Analytics.

A varient is a named object and consists of a single primary method and options supporting methods:

- `onChosen` - When this varient is the chosen varient these actions are what should be performed. You can add any JavaScript code there to make your edits. Text and
## Tracking Tests and Conversions

Test and conversion data is intended to be offloaded to a dedicated analytics platform - such as Google Analytics or Piwik - where it will be able to give the most value.

The framework bundles a storageAdapter to work with the Google Universal Analytics system but you can override the default and provide your own storageAdapter if you choose.

## Handling Consistency Between Pages and Visits

In most situations you want to make sure that once a user sees a varient that it's the same varient they see on every visit. The script handles this by storing the test that the user is currently a part of inside the localStorage of their browser.

### Licence

This software is released under the GPLv3 or later licence.

### Credits

This entire library was inspired and heavily influenced by the `cohorts.js` testing framework by @jamesyu: https://github.com/jamesyu/cohorts
