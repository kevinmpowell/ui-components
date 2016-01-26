var namespace = "ui-",
    more_menu_label_class = namespace + "more-menu-tabs__label--more",
    more_menu_tabs_class = namespace + "more-menu-tabs--more-menu",
    more_menu_visible_class = namespace + "more-menu-tabs--more-menu-visible",
    hidden_tab_label_class = namespace + "more-menu-tabs__label--hidden",
    visible_more_menu_item_class = namespace + "more-menu-tabs__more-menu-list-item--visible",
    visible_more_menu_label_class = namespace + "more-menu-tabs__more-menu-label--visible",
    selected_more_menu_label_class = namespace + "more-menu-tabs__more-menu-label--selected",
    selected_more_menu_item_class = namespace + "more-menu-tabs__more-menu-list-item--selected",
    all_tabs_hidden_class = namespace + "more-menu-tabs--all-tabs-hidden";

function set_more_menu_selected_state($tabs) {
  var selected_id = $tabs.find("." + namespace + "more-menu-tabs__radio-input:checked").attr("id"),
      $more_menu_label = $tabs.find("." + namespace + "more-menu-tabs__label--more"),
      $more_menu = $tabs.find("." + namespace + "more-menu-tabs__more-menu");

  $more_menu.find("." + selected_more_menu_item_class).removeClass(selected_more_menu_item_class);
  
  if ($more_menu.find("[for='" + selected_id + "']." + visible_more_menu_item_class).length > 0) {
    $more_menu_label.addClass(selected_more_menu_label_class);
    $more_menu.find("[for='" + selected_id + "']").addClass(selected_more_menu_item_class);
  }
  else {
    $more_menu_label.removeClass(selected_more_menu_label_class);
  }
}

function set_more_menu_tab_state($tabs) {
  var $more_menu_label = $tabs.find("." + namespace + "more-menu-tabs__label--more"),
      more_menu_label_width = $more_menu_label.outerWidth() + parseInt($more_menu_label.css("margin-left")) + parseInt($more_menu_label.css("margin-right")),
      more_menu_label_height = $more_menu_label.outerHeight() + parseInt($more_menu_label.css("margin-top")) + parseInt($more_menu_label.css("margin-bottom")),
      $content_tab_labels = $tabs.find("." + namespace + "more-menu-tabs__label:not(." + namespace + "more-menu-tabs__label--more)"),
      tabs_width = $tabs.outerWidth(),
      margin_of_error = 16,
      available_width = tabs_width - more_menu_label_width - margin_of_error,
      width_count = 0,
      $more_menu = $tabs.find("." + namespace + "more-menu-tabs__more-menu"),
      more_menu_label_visible = false,
      content_tabs_count = $content_tab_labels.length,
      content_tabs_hidden = 0,
      $more_menu_label_text_wrap = $more_menu_label.find("." + namespace + "more-menu-tabs__label-text--more"),
      more_menu_label_default_text = $more_menu_label_text_wrap.text();

  if ($tabs.attr("data-more-menu-label-width") == undefined) {
    $tabs.attr("data-more-menu-label-width", more_menu_label_width);
  }
  else {
    more_menu_label_width = $tabs.attr("data-more-menu-label-width");
    available_width = tabs_width - more_menu_label_width - margin_of_error;  
  }

  if ($tabs.attr("data-more-menu-default-label") == undefined) {
    $tabs.attr("data-more-menu-default-label", more_menu_label_default_text);
  }
  else {
    more_menu_label_default_text = $tabs.attr("data-more-menu-default-label");
  }

  $content_tab_labels.each(function(){
    var tab_id = $(this).attr("for");
    width_count += $(this).outerWidth() + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right"));
    if (width_count > available_width) {
      $(this).addClass(hidden_tab_label_class);
      $more_menu.find("[for='" + tab_id + "']").addClass(visible_more_menu_item_class);
      more_menu_label_visible = true;
      content_tabs_hidden++;
    }
    else {
      $(this).removeClass(hidden_tab_label_class);
      $more_menu.find("[for='" + tab_id + "']").removeClass(visible_more_menu_item_class);
    }
  });

  if (more_menu_label_visible) {
    $tabs.addClass(visible_more_menu_label_class);
  }
  else {
    $tabs.removeClass(visible_more_menu_label_class);
  }

  if (content_tabs_hidden == content_tabs_count) {
    if (!$tabs.hasClass(all_tabs_hidden_class)) {
      var existing_top_padding = parseInt($tabs.css("padding-top"));
          new_top_padding = existing_top_padding + more_menu_label_height,
          active_tab_id = $tabs.find("." + namespace + "more-menu-tabs__radio-input:checked").attr("id"),
          active_tab_text = $more_menu.find("[for='" + active_tab_id + "']").text(); 
      $tabs.addClass(all_tabs_hidden_class);
      $tabs.css("padding-top", new_top_padding + "px");
      $more_menu_label_text_wrap.text(active_tab_text);
    }
  }
  else {
    $tabs.css("padding-top", "");
    $tabs.removeClass(all_tabs_hidden_class);
    $more_menu_label_text_wrap.text(more_menu_label_default_text);
  }

  set_more_menu_selected_state($tabs);
}

function set_more_menu_state_for_all_more_menu_tabs() {
  $("." + more_menu_tabs_class).each(function(){
    set_more_menu_tab_state($(this));
  });
}

$(document).ready(function(){
  // Toggle more menu display
  $("." + more_menu_label_class).on("click", function(e){
    var $tabs = $(this).closest("." + namespace + "more-menu-tabs");
    $tabs.toggleClass(more_menu_visible_class);
  });

  $("." + namespace + "more-menu-tabs__more-menu-list-item").on("click", function(e){
    if ($(this).closest("." + all_tabs_hidden_class ).length > 0) {
      var text = $(this).text(),
          $more_label_text_wrap = $(this).closest("." + all_tabs_hidden_class).find("." + namespace + "more-menu-tabs__label-text--more");
      
      $more_label_text_wrap.text(text);
    }
  });

  $("body").on("click", function(e){
    var $target = $(e.target);
    if (!$target.hasClass(more_menu_label_class) && $target.closest("." + more_menu_label_class).length == 0) {
      $("." + more_menu_visible_class).removeClass(more_menu_visible_class);
    }
  });

  $("." + namespace + "more-menu-tabs__radio-input").on("change", function(){
    var $tabs = $(this).closest("." + namespace + "more-menu-tabs");
    set_more_menu_selected_state($tabs);
  });

  // Update more menu tabs on load
  set_more_menu_state_for_all_more_menu_tabs();

  // Update more menu tabs on window resize
  $(window).on('resize', function(){
    set_more_menu_state_for_all_more_menu_tabs();
  });
});
