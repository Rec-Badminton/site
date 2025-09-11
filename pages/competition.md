---
layout: page
title: Competition
keyword: Rec Badminton Compétition Rennes
description: Compétition Badminton
author: Rec Badminton
permalink: "/competition/"

---
<section class="competition container my-5">

  <h2 class="section-title text-center">{{ site.data.competition.tournaments.title }}</h2>
  <br/>
    <div class="row align-items-center">
      <div class="col-md-8">
        <p>{{ site.data.competition.tournaments.text1 }} <a href="{{ site.data.competition.tournaments.link1 }}" target="_blank">{{ site.data.competition.tournaments.link1 }}</a></p>
        <p>{{ site.data.competition.tournaments.text2 }}</p>
        <a class="link-container" target="_blank" href="{{ site.data.competition.tournaments.link1 }}">{{ site.data.competition.tournaments.button }}</a>
      </div>
      <br/>
      <div class="col-md-4 text-center">
        <img src="{{ site.data.competition.tournaments.image }}" alt="Photo tournoi" class="img-fluid rounded">
        <small class="d-block mt-2">{{ site.data.competition.tournaments.caption }}</small>
      </div>
    </div>
<br/><br/>
  <h2 class="section-title text-center">{{ site.data.competition.interclubs.title }}</h2>
  <p>{{ site.data.competition.interclubs.text1 }}</p>
  <p>{{ site.data.competition.interclubs.text2 }}</p>

  <!-- TABLEAU -->
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead>
        <tr>
          {% for header in site.data.competition.table.headers %}
            <th scope="col" class="text-center">{{ header }}</th>
          {% endfor %}
        </tr>
      </thead>
      <tbody>
        {% for row in site.data.competition.table.rows %}
          <tr scope="row">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
            <td>{{ row[3] }}</td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</section>
