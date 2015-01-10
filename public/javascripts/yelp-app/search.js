var getYelpResponse = function(resp) {
	$("#loading-indicator").hide();
	var $inputs = $("input").prop("disabled",false);
	var $ul = $("#jquery-results ul");
	$.each(resp.businesses, function (i, val) {
		$ul.append("<li>"+val.name+"</li>");
	});
};
$(function() {
	$("#jquery-search").click(function (e) {
		e.preventDefault();
		var $ul = $("#jquery-results ul").empty();
		var $term = $("input[name=search_term]");
		var $location = $("input[name=search_neighborhood]");
		if (!$term.val() || !$location.val())
			return false;

		var url = "http://api.yelp.com/business_review_search?callback=getYelpResponse";
		var q = "&term=" + encodeURIComponent($term.val());
		q += "&location=" + encodeURIComponent($location.val());
		q += "&ywsid=oQcjRFaFtJ6xs4_sxLUHyg";
		var s = document.createElement("script");
		s.src = url + q;
		s.type = "text/javascript";
		document.getElementsByTagName("head").item(0).appendChild(s);

		$("#loading-indicator").show();
		$("input").prop("disabled",true);
	});
});