/**
 * This is my version of "lightbox", but much more lightweight and no superfluous animations.
 *
 * Copyright (c) 2012, Dean Harding.
 *
 * Technically, we do more than just "lightbox" because we also add captions
 * to regular images as well.
 */

(function($) { $(function() {

    $("a.lightbox").on("click", "", function(evnt) {
        evnt.preventDefault();
        var bg = $("#lightbox-background");

        if (bg.size() == 0) {
            bg = $("<div id=\"lightbox-background\"><iframe src=\"about:blank\"></iframe></div>");
            $("body").append(bg);
        }

        var imgId = $(this).data("img-id");
        if (typeof imgId == "undefined") {
            imgId = ("img-"+Math.random()).replace("0.", "");
            var img = new Image();
            img.id = imgId;
            img.src = $(this).attr("href");
            var div = $("<div class=\"lightbox-image-container\" />");
            div.append(img).hide();
            $("body").append(div);
            $(this).data("img-id", imgId);
        }
        var imgContainer = $("#"+imgId).parents("div");

        bg.show();
        imgContainer.show();

        if (window.history.pushState) {
            window.history.pushState(null, "Image Popup", "#popup");
        }
    });

    $("a.lightbox img, img.show-caption").each(function() {
        var $this = $(this);
        if ($this.hasClass("no-caption")) {
            return;
        }

        var captionText = $this.attr("title");
        if (typeof captionText == "undefined" || captionText == "") {
            captionText = $this.attr("alt");
            if (typeof captionText == "undefined" || captionText == "") {
                captionText = $this.parents("a").attr("title");
            }
        }
        if (captionText == "") {
            return;
        }
        captionText = captionText.replace("\"", "&quot;").replace("<", "&lt;");

        var container = $("<div class=\"captioned-image\"></div>");
        container.css("position", "relative");
        // if the image is floated, the container should be similarly-floated
        if ($this.css("float")) {
          container.css("float", $this.css("float"));
        }
        var caption = $("<div class=\"caption\">"+captionText+"</div>");

        $this.wrap(container);
        $this.after(caption);

        if ($this.parents("a.lightbox").size() > 0) {
            caption.append("<img src=\"/img/zoom.png\" width=\"20\" height=\"20\" alt=\"Click to zoom\" />");
        }

        function setupCaption() {
            caption.css("width", ($this.width() - 4)+"px")
                   .css("position", "absolute")
                   .css("left", $this.get(0).offsetLeft+"px")
                   .css("bottom", "0")
                   .css("padding", "2px");
            $this.css("vertical-align", "bottom");
        }

        if ($this.width() <= 0) {
            caption.hide();
            $this.load(function() {
                setupCaption();
                caption.show();
            });
        } else {
            setupCaption();
        }

        // if the window resizes, we'll want to make sure the caption stays in place.
        $(window).resize(function() { setupCaption(); });
    });

    $("body").on("click", "div.lightbox-image-container", function(evnt) {
        evnt.preventDefault();

        $("#lightbox-background, div.lightbox-image-container").hide();
    }).on("keyup", "", function(evnt) {
        if (evnt.keyCode == 27) {
            $("#lightbox-background, div.lightbox-image-container").hide();
        }
        return true;
    });
    if (window.history) {
        $(window).bind("popstate", function() {
            $("#lightbox-background, div.lightbox-image-container").hide();
        });
    }

}); })(jQuery);

