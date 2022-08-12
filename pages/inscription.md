---
layout: page
title: Inscription
keyword: Rec Badminton Inscription
description: Inscription Badminton
author: Rec Badminton
permalink: "/inscription/"
menu:
  header:
    identifier: INSCRIPTION
    weight: 3
---
<div class="inscription">
  <div class="parent">
    <div class="div1">
      <h2>ENVIE DE NOUS REJOINDRE ?</h2>
      <p class="align">Si tu veux rejoindre le REC, tu es au bon endroit ! Toutes les informations concernant les modalités d'inscription ainsi que les bons plans sont présentés ci-dessous. Que ce soit pour une nouvelle adhésion ou un renouvellement de license, tu es le bienvenu au club du REC Badminton !</p>
      <img class="materiel" src="/assets/img/materiel.png" alt="matériel">
    </div>
    <div class="div2">
      <img class="d-block m-auto" src="/assets/img/qrcode.png" alt="qrcode">
      <h2>SÉANCE D'ESSAI</h2>
      <p class="align">Tu hésites et préfères participer à un entrainement avant de t'inscrire ? Pas de problème ! Deux séances d'essais sont acceptées.</p>
      <p>Lors de chaque séance, il est impératif de :</p>
      <ul class="dash">
        <li>Prévenir en amont de ta venue en envoyant un mail au bureau du club: <a class="col-lg order-lg-1" href="mailto:{{ site.data.contacts.email }}">{{site.data.contacts.email}}</a>. Ils pourront également te guider pour trouver le créneau le plus adapté à tes envies</li>
        <li>Te présenter à un membre du bureau présent sur le créneau</li>
        <li>Remplir le petit formulaire en flashant ce QR Code ci-contre</li>
      </ul>
    </div>
  </div>
  <div>
    <img class="d-block m-auto" src="/assets/img/terrain/terrain.svg">
  </div> 
  <div>
    <section>
      <h2>LES TARIFS</h2>
      <p>La cotisation au REC Badminton comprend :</p>
      <ul class="dash">
        <li>L'adhésion au club</li>
        <li>La license fédérale incluant une assurance</li>
        <li>L'accès aux entrainements (hors vacances) et créneaux de jeu libre</li>
        <li>L'accès aux événements organisés par le club</li>
        <li>L'accès à la boutique et aux tarifs avantageux chez nos partenaires</li>
      </ul>
      <table align="center">
        <thead>
          <th class="text-center">Minibad</th>
          <th class="text-center">Jeune</th>
          <th class="text-center">Loisir</th>
          <th class="text-center">Compétiteur</th>
        </thead>
        <tbody>
          <td>
            {{ site.data.prix.minibad }} €
            <img class="plume" src="/assets/img/plumes/Plume_jaune.png" alt="minibad">
          </td>
          <td>
            {{ site.data.prix.jeune }} €
            <img class="plume" src="/assets/img/plumes/Plume_verte.png" alt="jeune">
          </td>
          <td>
            {{ site.data.prix.loisir }} €
            <img class="plume" src="/assets/img/plumes/Plume_bleue.png" alt="loisir">
          </td>
          <td>
            {{ site.data.prix.competiteur }} €
            <img class="plume" src="/assets/img/plumes/Plume_rouge.png" alt="compétiteur">
          </td>
        </tbody>
      </table>
      <ul id="description">
        <li id="minibad">Minibad : jeunes nés en 2015 et après</li>
        <li id="jeune">Jeune : jeunes nés entre 2014 et 2005</li>
        <li id="adulte">Adultes Loisirs</li>
        <li id="competiteur">Adultes Compétiteurs : La formule Compétiteurs permet de participer aux interclubs et facilite l'accès pour l’inscription aux tournois avec le club, via le forum 6 tableaux offerts. Attention ! Les entraînements compétiteurs du mardi et jeudi sont réservés aux licenciés ayant un niveau confirmé ou avancé. Les joueurs compétiteurs débutants sont incités à pratiquer le cours du lundi à 20h30.</li>
      </ul>
    </section>
    <section>
      <h2>LES CRÉNEAUX</h2>
      <img class="plume" src="/assets/img/heure.jpg" alt="créneaux">
      <p class="creneau">Retrouve la <a href="{{ site.baseurl }}/creneaux">liste des créneaux ici</a></p>
    </section>
    <section>
      <h2>BESOIN DE S'ÉQUIPER ?</h2>
      <p class="creneau">Retrouve nos conseils dédiés à <a href="{{ site.baseurl }}/boutique">l'équipement ici</a></p>
    </section>
  </div>
</div>
