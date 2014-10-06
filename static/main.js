$(function () {
    $('form.todo input').on('change', function (e) {
        $(e.currentTarget).closest('form').submit();
    });
    var forms = $('form.todo');
    forms.find('input.name').on('blur', function (e) {
        $(e.currentTarget).closest('form').removeClass('edit');
    });
    forms.find('.remove').on('click', function (e) {
        var form = $(e.currentTarget).closest('form');
        var url = '/edit/:id'.replace(':id', form.data('todo-id'));
        $.ajax({type: 'delete', url: url}).done(function () {
            var li = form.parent().slideUp(function () {
                li.remove();
                var list = $('ul.todos');
                if (list.find('li').length === 1) {
                    list.addClass('empty');
                }
            });
        });
    });
    forms.on('submit', function (e) {
        e.preventDefault();
        var form = $(e.currentTarget);
        var url = '/edit/:id'.replace(':id', form.data('todo-id'));
        var input = form.find('input.name');
        if ($.trim(input.val()).length === 0) {
            return;
        }
        var div = form.find('div.name');
        var checkbox = form.find('input[name="done"]');
        var done = checkbox.is(':checked');
        $.post(url, {name: input.val(), done: done}).done(function () {
            console.log('saved');
            div.text(input.val());
        }).fail(function (xhr) {
            input.val(div.text());
            done ? checkbox.attr('checked', 'checked') : checkbox.removeAttr('checked');
            form.addClass('edit');
            alert(JSON.stringify(xhr.responseJSON.errors));
        }).always(function () {
            form.removeClass('edit').find('input').removeAttr('disabled');
        });
        form.find('input').attr('disabled', 'disabled');
        return false;
    });
    forms.find('input.name').on('keydown', function (e) {
        var input = $(e.currentTarget);
        if (e.which === 13) {  // enter key
            //input.closest('form').submit();
            //e.preventDefault();
        }
        else if (e.which === 27) {  // escape key
            input.blur();
        }
    });
    forms.find('div.name').on('dblclick', function (e) {
        var div = $(e.currentTarget);
        var input = div.closest('form').addClass('edit').find('input.name');
        var initialValue = input.val();
        input.val('').focus().val(initialValue);
    });

    function getCookie (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod (method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        dataType: 'json'
    });
});