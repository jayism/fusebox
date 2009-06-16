(function($) {
  $.fusebox = {
    close: function() {
      $(document).trigger("close.fusebox");
      return false;
    },
    display: function(selector) {
      $.fusebox.container()
        .children(".fusebox").hide().end()                                     // hide all children
        .find(".fusebox:has(" + selector + ")").show().end()                   // display current selector
        .fadeIn("slow")                                                        // display .fusebox-container
        .css("left", $(window).width()/2 - ($.fusebox.container().width()/2)); // position correctly
    },
    bindings: {
      close: function() {
        $(document).unbind("keydown.fusebox");
        $.fusebox.container.hide();
      },
      keydown: function(event) {
        if(event.keyCode == 27) { $.fusebox.close(); }
        return true;
      },
      click: function() {
        $(document).bind("keydown.fusebox", $.fusebox.bindings.keydown).trigger("loading.fusebox");
        if(typeof($(this).data("fuseboxTargetSelector")) == "undefined") { return true; }
        $.fusebox.container.show($(this).data("fuseboxTargetSelector"));
        return false;
      }
    }
  };
  $(document).bind("close.fusebox", $.fusebox.bindings.close);
})(jQuery);
(function($) {
  $.fn.fusebox = function(selector) {
    if($(this).length === 0) { return; }

    $.fusebox.container.initialize();
    $("a.fusebox-target").live("click", $.fusebox.bindings.click);

    return this.each(function(index) {
      var $anchor = $(this), $fuseboxContent, fuseboxSelector;

      $.each($anchor.attr("class").split(/ /), function(idx, cssClass) {
        fuseboxSelector = ".fusebox-" + cssClass;
        if($(fuseboxSelector).length == 1) {
          $anchor.data("fuseboxTargetSelector", fuseboxSelector);
          $fuseboxContent = $(fuseboxSelector);
          return false;
        }
      });

      if(typeof($fuseboxContent) == "undefined") { return; }
      $.fusebox.container.append($fuseboxContent);
      $anchor.addClass("fusebox-target");
    });
  };
})(jQuery);
(function($) {
  var fuseboxContainerClass = "fusebox-container";

  $.fusebox.container = function() { return $("." + fuseboxContainerClass); };
  $.extend($.fusebox.container, {
    initialize: function() {
      if($.fusebox.container().length > 0) { return; }
      $("body").append($("<div class='" + fuseboxContainerClass + "'><div class='ui-widget-shadow'></div></div>"));
    },
    append: function(element) {
      $.fusebox.container().append($("<div class='fusebox ui-widget-content'>").append(element));
    },
    show: function(selector) {
      $(document).trigger("beforeShow.fusebox");
      if($.fusebox.container().is(":visible")) {
        $.fusebox.container().fadeOut("slow", function() { 
          $.fusebox.display(selector);
        });
      } else {
        $.fusebox.container().hide();
        $.fusebox.display(selector);
      }
      $(document).trigger("show.fusebox").trigger("afterShow.fusebox");
    },
    hide: function() {
      $(document).trigger("beforeHide.fusebox");
      $.fusebox.container().fadeOut("slow");
      $(document).trigger("hide.fusebox").trigger("afterHide.fusebox");
    }
  });
})(jQuery);
