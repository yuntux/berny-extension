"use strict";

exports.removeDifferentElements = exports.wrapElement = void 0;

var _iterator = require("../../core/utils/iterator");

var addAttributes = function addAttributes($element, attributes) {
  (0, _iterator.each)(attributes, function (_, _ref) {
    var name = _ref.name,
        value = _ref.value;

    if (name === "class") {
      $element.addClass(value);
    } else {
      $element.attr(name, value);
    }
  });
};

var wrapElement = function wrapElement($element, $wrapper) {
  var _$wrapper$get = $wrapper.get(0),
      attributes = _$wrapper$get.attributes;

  var children = $wrapper.contents();
  addAttributes($element, attributes);
  $wrapper.remove();
  (0, _iterator.each)(children, function (_, child) {
    $element.append(child);
  });
  return children;
};

exports.wrapElement = wrapElement;

var removeDifferentElements = function removeDifferentElements($children, $newChildren) {
  (0, _iterator.each)($newChildren, function (__, element) {
    var hasComponent = false;
    (0, _iterator.each)($children, function (_, oldElement) {
      if (element === oldElement) {
        hasComponent = true;
      }
    });

    if (!hasComponent && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};

exports.removeDifferentElements = removeDifferentElements;