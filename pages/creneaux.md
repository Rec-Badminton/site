---
layout: page
title: Créneaux
keyword: Créneaux Rec Badminton REC Rennes
description: 'Toutes les infos créneaux du Rec Badminton'
author: Rec Badminton
permalink: "/creneaux/"
menu:
  header:
    identifier: CRENEAUX
    weight: 2

---

<section class="creneaux">
  <h2 class="text-center">CALENDRIER DE LA SAISON</h2>
  <iframe src="{{ site.data.rec.calendar }}" style="border-width:0" width="800" height="440" frameborder="0" scrolling="no"></iframe>
  <br/>
  <br/>
  <div class="table-responsive">
    <h2 class="text-center">INFORMATIONS CRÉNEAUX</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col" class="text-center">JOUR</th>
          <th scope="col" class="text-center">HORAIRES</th>
          <th scope="col" class="text-center">LIEU</th>
          <th scope="col" class="text-center">ENTRAINEUR</th>
          <th scope="col" class="text-center">DESCRIPTION</th>
        </tr>
      </thead>
      <tbody>
      {%- assign jours = "" -%}
      {%- for creneau in site.data.creneaux.creneaux -%}
        {%- unless jours contains creneau.jour -%}
          {%- assign jours = jours | append: creneau.jour | append: "," -%}
        {%- endunless -%}
      {%- endfor -%}
      {%- assign jours_array = jours | split: "," | uniq -%}
      {%- for jour in jours_array -%}
        {%- assign mod = forloop.index0 | modulo: 2 -%}
        {%- if jour != "" -%}
          {%- assign creneaux_jour = "" | split: "" -%}
          {%- for creneau in site.data.creneaux.creneaux -%}
            {%- if creneau.jour == jour -%}
              {%- assign creneaux_jour = creneaux_jour | push: creneau -%}
            {%- endif -%}
          {%- endfor -%}
          {%- assign nb_creneaux = creneaux_jour | size -%}
          {%- for creneau in creneaux_jour -%}
            <tr {% if mod != 0 %} class="table-active"{% endif %}>
              {%- if forloop.first -%}
                <th scope="row" rowspan="{{ nb_creneaux }}" class="text-center">{{ jour }}</th>
              {%- endif -%}
              <td class="text-center">
                {% if creneau.start and creneau.end %}
                  {{ creneau.start }} - {{ creneau.end }}
                  {%- if creneau.isFull -%}
                    <div class="text-danger"><b>COMPLET</b></div>
                  {%- endif -%}
                  {%- if creneau.isWaitingList -%}
                    <div class="brand-color"><b>LISTE D'ATTENTE</b></div>
                  {%- endif -%}
                  {%- if creneau.membersOnly -%}
                    <div class="text-danger"><b>RÉSERVÉ AUX LICENCIÉS</b></div>
                  {%- endif -%}
                {% else %}
                  /
                {% endif %}
              </td>
              {% assign salle_path = creneau.salle %}
              {% assign salle_key = salle_path | split: '/' | last | split: '.' | first %}
              {% assign salle = site.data.salles[salle_key] %}
              <td class="text-center">
                {% if salle %}
                  <a href="{{ salle.location }}" target="_blank">
                    {{ salle.titre }}
                  </a>
                {% else %}
                  /
                {% endif %}
              </td>
              <td class="text-center">
                {%- assign entraineur_list = "" -%}
                {%- if creneau.entraineurs and creneau.entraineurs != empty -%}
                  {%- for ent in creneau.entraineurs -%}
                    {%- assign ent_path = ent.entraineurs -%}
                    {%- assign ent_key = ent_path | split: '/' | last | split: '.' | first -%}
                    {%- assign entraineur = site.data.entraineurs[ent_key] -%}
                    {%- if entraineur_list != "" -%}
                      {%- assign entraineur_list = entraineur_list | append: " & " -%}
                    {%- endif -%}
                    {%- assign entraineur_list = entraineur_list | append: entraineur.titre -%}
                  {%- endfor -%}
                  {{ entraineur_list }}
                {%- else -%}
                  /
                {%- endif -%}
              </td>
              <td{% if creneau.niveaux == nil or creneau.niveaux == empty %} class="text-center" {% endif %}>
                {% if creneau.niveaux != nil and creneau.niveaux != empty %}
                  {% for niveau_path in creneau.niveaux %}
                    {% assign niveau_key = niveau_path | split: '/' | last | split: '.' | first %}
                    {% assign niveau = site.data.niveaux[niveau_key] %}
                    <img
                      src="{{ site.baseurl }}/assets/data/{{ niveau.logo }}"
                      alt="{{ niveau.titre }}"
                      title="{{ niveau.titre }}">
                  {% endfor %}
                  {{ creneau.description }}
                {% else %}
                  /
                {% endif %}
              </td>
            </tr>
          {%- endfor -%}
        {%- endif -%}
      {%- endfor -%}
      </tbody>
    </table>
  </div>
  <div class="legend">
    {% assign niveaux_list = "" | split: "" %}
    {% for item in site.data.niveaux %}
      {% assign niveau = item[1] %}
      {% assign niveaux_list = niveaux_list | push: niveau %}
    {% endfor %}
    {% assign niveaux_sorted = niveaux_list | sort: "ordre" %}
    {% for niveau in niveaux_sorted %}
      <img
        src="{{ site.baseurl }}/assets/data/{{ niveau.logo }}"
        alt="{{ niveau.titre }}"
        title="{{ niveau.titre }}">
      <b>{{ niveau.titre }}</b> : {{ niveau.description }}<br/>
    {% endfor %}
    <br/>
    <p>Les entraînements adultes sont séparés par niveau :</p>
    <ul>
      <li>le <u>lundi</u> à 20h30 et le  <u>mercredi</u> à 17h00 pour les compétiteurs <b>débutants</b> (jusqu'au classement P)</li>
      <li>le <u>mardi</u> et le <u>jeudi</u> pour les adultes compétiteurs classés et <b>confirmés</b> (à partir du classement D)</li>
    </ul>
  </div>
  <br/>
  <br/>
  <h2 class="text-center">Le créneau que tu souhaites est complet ?</h2>
  <p><a href="{{ site.data.rec.liste_attente }}" target="_blank">Inscris-toi sur la liste d’attente</a> pour être contacté si des places se libèrent (généralement en novembre ou février)</p>
</section>
