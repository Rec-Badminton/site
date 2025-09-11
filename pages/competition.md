---
layout: page
title: Competition
keyword: Rec Badminton Compétition Rennes
description: Compétition Badminton
author: Rec Badminton
permalink: "/competition/"

---
<section class="competition container my-5">

    <h2 class="section-title text-center">{{ data.competition.tournaments.title }}</h2>
    <div class="row align-items-center">
      <div class="col-md-8">
        <p>{{ data.competition.tournaments.text1 }} <a href="{{ data.competition.tournaments.link1 }}" target="_blank">{{ data.competition.tournaments.link1 }}</a></p>
        <p>{{ data.competition.tournaments.text2 }}</p>
        <a href="{{ data.competition.tournaments.link1 }}" target="_blank" class="btn btn-custom">{{ data.competition.tournaments.button }}</a>
      </div>
      <div class="col-md-4 text-center">
        <img src="{{ data.competition.tournaments.image }}" alt="Photo tournoi" class="img-fluid rounded">
        <small class="d-block mt-2">{{ data.competition.tournaments.caption }}</small>
      </div>
    </div>

    <h2 class="section-title text-center">{{ data.competition.interclubs.title }}</h2>
    <p>{{ data.competition.interclubs.text1 }}</p>
    <p>{{ data.competition.interclubs.text2 }}</p>

    <!-- TABLEAU -->
    <div class="table-responsive">
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            {% for header in data.competition.table.headers %}
              <th>{{ header }}</th>
            {% endfor %}
          </tr>
        </thead>
        <tbody>
          {% for row in data.competition.table.rows %}
            <tr>
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
