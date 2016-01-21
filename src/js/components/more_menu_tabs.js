var namespace = "ui-",
    tab_width_data_attribute = "data-" + namespace + "more-menu-tabs-horizontal-sliding-single-line-width";

function get_aggregate_width($objects) {
  var width = 0;
  $objects.each(function(){
    width += $(this).outerWidth() + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right"));
  });
  return width;
}

function set_more_menu_tab_state($tabs) {

}

$(document).ready(function(){
  $("." + namespace + "more-menu-tabs--more-menu").each(function(){
    var single_line_tab_width = get_aggregate_width($(this).find("." + namespace + "more-menu-tabs__label"));
    $(this).attr(tab_width_data_attribute, single_line_tab_width);

    set_more_menu_tab_state($(this));
  });

  $("." + namespace + "more-menu-tabs__label--more").on("click", function(e){
    var $tabs = $(this).closest("." + namespace + "more-menu-tabs");

    $tabs.toggleClass(namespace + "more-menu-tabs--more-menu-visible");
  });
})
