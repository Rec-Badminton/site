---
layout: page
title: Inscription
keyword: Rec Badminton Inscription Rennes
description: Inscription Badminton
author: Rec Badminton
permalink: "/inscription/"
menu:
  header:
    identifier: INSCRIPTION
    weight: 3
---
<div class="inscription">
  <h2>ENVIE DE NOUS REJOINDRE ?</h2>
  <p>Si tu veux rejoindre le REC, tu es au bon endroit ! Toutes les informations concernant les modalités d'inscription ainsi que les bons plans sont présentés ci-dessous. Que ce soit pour une nouvelle adhésion ou un renouvellement de licence, tu es le bienvenu au club du REC Badminton !</p>
  <div class="parent">
    <div class="div1">
      <h2>SÉANCE D'ESSAI</h2>
      <p class="align">Tu hésites et préfères participer à un entrainement avant de t'inscrire ? Pas de problème ! Deux séances d'essais sont acceptées.</p>
      <p>Lors de chaque séance, il est impératif de :</p>
      <ul class="dash">
        <li>Te présenter à un membre du bureau présent sur le créneau</li>
        <li>Remplir le petit formulaire en flashant ou cliquant sur le QR Code ci-contre. Ce formulaire te permet d’être assuré pendant 24h pour la pratique du badminton</li>
        <li>Prévenir en amont de ta venue en envoyant un mail au bureau du club: <a class="col-lg order-lg-1" href="mailto:{{ site.data.rec.email }}">{{site.data.rec.email}}</a>. Ils pourront également te guider pour trouver le créneau le plus adapté à tes envies.<br/>
        Attention, les places et la disponibilité des créneaux peuvent très vite partir en début de saison !</li>
        <li><b>Séances d'essai du 2 au 13 septembre. Ouverture des inscriptions le 14 septembre.</b> Seuls les dossiers complets seront acceptés. Places limitées, <b>pas de réservation d’inscription possible.</b></li>
        <li>Dates des reprises <a target="_blank" href="/assets/img/reprise.jpg">à consulter ici</a></li>
      </ul>
    </div>
    <div class="div2">
      <a href="https://poona.ffbad.org/page.php?P=fo/menu/public/accueil/operation_promo_participant&k=NDAwOUAyMg==" target="_blank"><img class="d-block m-auto qrcode" src="{{site.baseurl}}/assets/img/qrcode_2425.PNG" alt="qrcode">
            <i>QR à compléter le jour même de la séance</i>
</a><br/>
    </div>
  </div>
  <div>
  <br/>
  <div class="row">
    <div class="col-md-6">
      <div class="card h-100">
        <h2 class="card-header">NOUVELLE ADHESION</h2>
        <div class="card-body">
          <p class="align">L’inscription se fait dorénavant exclusivement en ligne sur :<br/>
            <a href="{{ site.data.ffbad.licence }}">{{ site.data.ffbad.licence }}</a><br/><br/>
              Plus besoin du certificat médical obligatoire, mais questionnaire de santé à remplir directement lors de l’inscription en ligne. Si l’une des questions donne lieu à une réponse positive, un certificat médical datant de moins de 6 mois devra être fourni avec la demande de licence.  <br/><br/>
              N’hésite pas à nous envoyer un mail pour que nous puissions te guider à choisir les plus créneaux les plus adaptés à ton niveau et à tes envies ou à venir faire une séance d'essai.
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card h-100">
        <h2 class="card-header">RENOUVELLEMENT DE LICENCE</h2>
        <div class="card-body">
          <p class="align">Ancien du REC, renouvelle ta licence plus rapidement sur ton espace licencié : <br/>
            <a href="{{ site.data.ffbad.site }}">{{ site.data.ffbad.site }}</a><br/><br/>
              Déjà licencié auparavant et tu veux rejoindre le REC cette saison, retrouve ton numéro de licence et inscrit toi en ligne sur :<br/>
              <a href="{{ site.data.ffbad.licence }}">{{ site.data.ffbad.licence }}</a><br/><br/>
              Plus besoin du certificat médical obligatoire, mais questionnaire de santé à remplir directement lors de l’inscription en ligne. Si l’une des questions donne lieu à une réponse positive, un certificat médical datant de moins de 6 mois devra être fourni avec la demande de licence.
            </p>
        </div>
      </div>
    </div>
  <div class="livret">
    <a class="link-container" target="_blank" href="/assets/data/LIVRET_BIENVENUE AU REC.pdf">A LIRE : LIVRET D'ACCUEIL</a>
  </div>
  <div>
    <section>
      <h2>LES TARIFS</h2>
      <p>La cotisation au REC Badminton comprend :</p>
      <ul class="dash">
        <li>L'adhésion au club</li>
        <li>La licence fédérale incluant une assurance</li>
        <li>L'accès aux entrainements (hors vacances) et créneaux de jeu libre</li>
        <li>L'équivalent de 6 tableaux de tournois offerts en passant par l'interface web du club</li>
        <li>L'accès aux événements organisés par le club</li>
        <li>L'accès à la boutique et aux tarifs avantageux chez nos partenaires</li>
      </ul>
      <table align="center">
        <thead>
          {% for cat in site.data.categories %}
            <th class="text-center">{{ cat.titre }}</th>
          {% endfor %}
        </thead>
        <tbody>
          {% assign niveaux_list = "" | split: "" %}
          {% for item in site.data.niveaux %}
            {% assign niveau = item[1] %}
            {% assign niveaux_list = niveaux_list | push: niveau %}
          {% endfor %}
          {% assign niveaux_sorted = niveaux_list | sort: "ordre" %}
          {% for niveau in niveaux_sorted %}
            <td>
              {{ niveau.tarif }} €
              <img
                class="plume"
                src="{{ site.baseurl }}/assets/data/{{ niveau.logo }}"
                alt="{{ niveau.titre }}"
                title="{{ niveau.titre }}">
            </td>
          {% endfor %}
        </tbody>
      </table>
      <ul id="description">
        {% assign niveaux_list = "" | split: "" %}
        {% for item in site.data.niveaux %}
          {% assign niveau = item[1] %}
          {% assign niveaux_list = niveaux_list | push: niveau %}
        {% endfor %}
        {% assign niveaux_sorted = niveaux_list | sort: "ordre" %}
        {% for niveau in niveaux_sorted %}
          <li>
            <img
              src="{{ site.baseurl }}/assets/data/{{ niveau.logo }}"
              alt="{{ niveau.titre }}"
              title="{{ niveau.titre }}">
            {{ niveau.titre }} : {{ niveau.description }}<br/>
          </li>
        {% endfor %}
      </ul>
      <ul>
        <li id="description"><b>Réduction de 15€</b> pour les <b>étudiants</b> à joindre obligatoirement lors de l’inscription en ligne.</li>
        <li><b>Réduction Pass’sport</b> sur présentation d’un justificatif lors de l’inscription en ligne. </li>
        <li>Possibilité de payer par <b>Chèques Vacances ANCV</b> en choisissant “autres moyens de paiement“. </li>
        <li><b>Aucun remboursement</b> ne pourra être demandé après l’inscription validée par le club.</li>
      </ul>
      <p>L'inscription comprend la possibilité de participer à <span class="brand-color"><b>2 créneaux maximum</b></span> durant la semaine à choisir lors de l'inscription en fonction des disponibilités. Avec un créneau supplémentaire de jeu libre pour tous le vendredi et/ou le dimanche.</p><br/>
      <p>Attention ! Les entraînements compétiteurs du mardi et jeudi sont réservés aux licenciés ayant un niveau confirmé ou avancé. Les joueurs compétiteurs débutants seront orientés vers le cours du lundi à 20h30.</p>
    </section>
    <section>
      <h2>LES CRÉNEAUX</h2>
      <p class="creneau">Retrouve la <a href="{{ site.baseurl }}/creneaux">liste des créneaux ici</a></p>
    </section>
    <section>
      <h2>BESOIN DE S'ÉQUIPER ?</h2>
      <p class="creneau">Retrouve nos conseils dédiés à <a href="{{ site.baseurl }}/boutique">l'équipement ici</a></p>
    </section>
  </div>
</div>
