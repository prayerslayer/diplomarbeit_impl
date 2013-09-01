//see https://github.com/marionettejs/backbone.marionette/issues/78#issuecomment-5185448

(function($) {
  return jQuery.fn.insertAt = function(index, element) {
    var lastIndex;
    if (index <= 0) return this.prepend(element);
    lastIndex = this.children().size();
    if (index >= lastIndex) return this.append(element);
    return $(this.children()[index - 1]).after(element);
  };
})(jQuery);