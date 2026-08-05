---
layout: page
title: Contact
keyword: Rec Badminton Contact Rennes
description: Contact Rec Badminton Rennes
author: Rec Badminton
permalink: "/contact/"
content: 'Contactez nous via facebook ou email: recbad35@gmail.com'
menu:
  header:
    identifier: CONTACT
    weight: 6

---
<section class="contact">
  Une question ? Écris-nous et nous te répondrons au plus vite !

 <!-- Bloc WhatsApp -->
  <div style="display:flex; align-items:center; justify-content:center; gap:30px; flex-wrap:wrap; margin:3px 0;">
    <div style="flex:1; min-width:130px;">
      <strong>Déjà inscrit au REC ?</strong><br/>
      Tu peux rejoindre le groupe WhatsApp du club en scannant le QR code ci-contre, puis poser ta question dans le canal <strong>"Contact Bureau"</strong>.
    </div>

<div>
  <a href="https://chat.whatsapp.com/JsHjLGqTTFf2lbITJEciJb"
     target="_blank"
     rel="noopener noreferrer"
     title="Rejoindre le groupe WhatsApp du REC Badminton">
    <img
      src="/assets/img/qr_code_WA_REC.png"
      alt="QR Code du groupe WhatsApp du REC Badminton"
      style="max-width:130px; height:auto; cursor:pointer;"
    />
  </a>
</div>

</div> <!-- Fin du bloc WhatsApp -->
  
  <form
  action="https://formspree.io/f/mgejedpl"
  method="POST"
>
<br/>
 <div class="form-group">
    <label for="name" required class="form-label">Votre nom/prénom :</label>
    <input type="name" required class="form-control" id="name" aria-describedby="nameHelp" name="name" placeholder="Veuillez indiquer votre nom et prénom">
  </div><br/>
  <div class="form-group">
    <label for="email" class="form-label">Email :</label>
    <input type="email" name="email" required class="form-control" id="email" aria-describedby="emailHelp" placeholder="Entrez votre email">
  </div><br/>
   <div class="form-group">
    <label for="message" class="form-label">Votre message :</label>
    <textarea class="form-control" name="message" required id="message" rows="5"></textarea>
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
</section>
