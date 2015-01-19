(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module
		define(['jquery', 'lodash'], factory);
	} else {
		// Browser globals
		factory(jQuery, _);
	}
}(function ($, _) {

	function shimIteratee (callback) {
		return function (value, key, list) {
			return callback.call(value, key, value, list);
		}
	}

	// Core Utilities

	$.each = function (collection, callback) {
		return _.each(collection, shimIteratee(callback));
	};

	$.map = function (collection, callback) {
		return _.map(collection, shimIteratee(callback));
	};

	$.inArray = _.indexOf;
	$.merge = _.zip;

	// Grep is a combination of filter and reject, depending on last argument

	$.grep = function (elems, callback, invert) {
		return (invert ? _.reject : _.filter)(elems, shimIteratee(callback));
	};

	// Extend/Merge

	$.extend = $.fn.extend = function (deep) {
		var args = _.toArray(arguments);

		// Handle a deep copy situation
		if ('boolean' === typeof deep) {
			args.shift();
		}

		// Extend context (jQuery itself) if only one argument is passed
		if (args.length === 1) {
			args.unshift(this);
		}

		// Deep extend
		if (true === deep) {
			return _.merge.apply(this, args);
		}

		// Shallow extend
		return _.extend.apply(this, args);
	};

	// Underscore integration

	_.each(
		'max min sortBy shuffle sample first initial last rest without'.split(' '),
		function (method) {
			$.fn[method] = function () {
				var args = _.zip([this], arguments);
				args = _.map(args, function (val) {
					if (_.isFunction(val)) {
						return shimIteratee(val);
					}
					return val;
				});
				var result = _[method].apply(this, args);
				// Sometimes the result can be a single element, so wrap in array
				return this.pushStack(_.isArray(result) ? result : [result]);
			};
		}
	);

}));
