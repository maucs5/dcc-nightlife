$(document).ready(function() {
  $('.going').click(function(e) {
    var parent = $(this)
    e.preventDefault()
    var id = parent.attr('id')
    $.ajax({url: '/click/'+id})
      .done(function(msg) {
	if (msg.error) alert(msg.error)
	else {
	  var element = parent.find('.count')
	  var c = +element.html()
	  if (msg.action === 'add') c++
	  else c--
	  element.html(c)
	}
      })
  })
})
