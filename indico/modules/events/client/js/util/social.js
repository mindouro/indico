// This file is part of Indico.
// Copyright (C) 2002 - 2023 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

/* global FB */

(function() {
  function injectFacebook(appId) {
    $.getScript('//connect.facebook.net/en_US/all.js#xfbml=1', function() {
      FB.init({appId, status: true, cookie: false, xfbml: true});
      FB.Event.subscribe('xfbml.render', function() {
        // when the "Like" button gets rendered, replace the "loading" message
        $('#fb-loading').hide();
        $('#fb-like').css('visibility', 'visible');
      });
      FB.XFBML.parse();
    });
  }

  $(document).ready(function() {
    const container = $('.social-button-container');
    if (!container.length) {
      return;
    }

    const dark = container.data('dark-theme');
    $('.social-button').qtip({
      style: {
        width: '420px',
        classes: `qtip-rounded qtip-shadow social_share_tooltip ${
          dark ? 'qtip-dark' : 'qtip-blue'
        }`,
      },
      position: {
        my: 'bottom right',
        at: 'top center',
      },
      content: $('.social-share'),
      show: {
        event: 'click',
        effect() {
          $(this).slideDown(200);
        },
        target: $('.social-button'),
      },
      hide: {
        event: 'unfocus click',
        fixed: true,
        effect() {
          $(this).fadeOut(300);
        },
      },
      events: {
        render() {
          injectFacebook($('.social-button-container').data('social-settings').facebook_app_id);
          $.getScript('//apis.google.com/js/plusone.js');
          $.getScript('//platform.twitter.com/widgets.js');
        },
        hide() {
          $('.social-button-container').css('opacity', '');
        },
        show() {
          $('.social-button-container').css('opacity', 1.0);
        },
      },
    });

    container.delay(250).fadeIn(1000);
  });
})();
