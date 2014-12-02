(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module
		define(['jquery', 'underscore'], factory);
	} else {
		// Browser globals
		factory(jQuery, _);
	}
}(function ($, _) {

	// Core Utilities

	$.each = _.each;
	$.inArray = _.lastIndexOf;
	$.map = _.map;
	$.merge = _.zip;

	// Grep is a combination of filter and reject, depending on last argument

	$.grep = function (elems, callback, invert) {
		return (invert ? _.reject : _.filter)(elems, callback);
	};

	// Deep extend using Lo-dash's _.merge, otherwise use jQuery's $.extend

	var deepExtend = _.merge || function (extend) {
		return function () {
			return extend.apply(this, _.zip([true], arguments));
		};
	}($.extend);

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
			return deepExtend.apply(this, args);
		}

		// Shallow extend
		return _.extend.apply(this, args);
	};

	// Underscore integration

	_.each(
		'max min sortBy shuffle sample first initial last rest without'.split(' '),
		function (method) {
			$.fn[method] = function () {
				var result = _[method].apply(this, _.zip([this], arguments));
				// Sometimes the result can be a single element, so wrap in array
				return this.pushStack(_.isArray(result) ? result : [result]);
			};
		}
	);

}));