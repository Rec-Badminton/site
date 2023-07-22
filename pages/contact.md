---
layout: page
title: Contact
keyword: Rec Badminton Contact
description: Contact Rec Badminton
author: Rec Badminton
permalink: "/contact/"
content: 'Contactez nous via facebook ou email: recbad35@gmail.com'
menu:
  header:
    identifier: CONTACT
    weight: 6

---
<div class="contact">
  Une question ? Écris-nous et nous te répondrons au plus vite !<br/>
  <form
  target="_blank"
  action="https://formspree.io/f/mgejedpl"
  method="POST"
>
<br/>
 <div class="form-group">
    <label for="name" class="form-label">Votre nom/prénom :</label>
    <input type="name" class="form-control" id="name" aria-describedby="nameHelp" placeholder="Veuillez indiquer votre nom et prénom">
  </div><br/>
  <div class="form-group">
    <label for="email" class="form-label">Email :</label>
    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Entrez votre email">
  </div><br/>
   <div class="form-group">
    <label for="message" class="form-label">Votre message :</label>
    <textarea class="form-control" id="message" rows="5"></textarea>
  </div><br/>
    <button type="submit" class="btn btn-primary float-end">Envoyer</button>
</form>
  On espère te croiser sur le terrain ou lors de nos évènements ! ;)

  <!-- Messenger Plugin de discussion Code -->
    <div id="fb-root"></div>

    <!-- Your Plugin de discussion code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

    <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "558060577711784");
      chatbox.setAttribute("attribution", "biz_inbox");
    </script>

    <!-- Your SDK code -->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v17.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
</div>