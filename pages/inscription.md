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
      <img class="materiel" src="/assets/img/materiel.png">
    </div>
    <div class="div2">
      <img class="d-block m-auto" src="/assets/img/qrcode.png">
      <h2>SÉANCE D'ESSAI</h2>
      <p class="align">Tu hésites et préfères participer à un entrainement avant de t'inscrire ? Pas de problème ! Deux séances d'essais sont acceptées. Lors de chaque séance, il est impératif de te présenter à un memebre du bureau présent sur le créneau, et de remplir le petit formulaire en flashant cs QR Code ci-contre.</p>
    </div>
    <div class="w-100">
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
              <img class="plume" src="/assets/img/plumes/Plume_jaune.png">
            </td>
            <td>
              {{ site.data.prix.jeune }} €
              <img class="plume" src="/assets/img/plumes/Plume_verte.png">
            </td>
            <td>
              {{ site.data.prix.loisir }} €
              <img class="plume" src="/assets/img/plumes/Plume_bleue.png">
            </td>
            <td>
              {{ site.data.prix.competiteur }} €
              <img class="plume" src="/assets/img/plumes/Plume_rouge.png">
            </td>
          </tbody>
        </table>
        <ul id="description">
          <li id="minibad">Minibad : ayant 7 ans ou moins dans l'année de début de saison</li>
          <li id="jeune">Jeune : ayant entre 8 et 17 ans dans l'année de début de saison</li>
          <li id="adulte">Adultes : ayant 18 ans ou plus dans l'année de début de saison</li>
          <li id="competiteur">La formule compétiteur donne accès aux entrainenement compétiteurs et au remboursement de 6 tableaux offerts par le club. Attention ! Les places compétiteurs étant limitées, et afin que l'encadrement soit le plus adapté, les entraîneurs se réservent le droit de demander à un joueur de basculer sur l'entraînement loisir, s'ils jugent son niveau insuffisant pour participer à l'entraînement.</li>
        </ul>
      </section>
      <section>
        <h2>LES CRÉNEAUX</h2>
        <img class="plume" src="/assets/img/heure.jpg">
        <p class="creneau">Retrouve la <a href="{{ site.baseurl }}/creneaux">liste des créneaux ici</a></p>
      </section>
    </div>
  </div> 
</div>
