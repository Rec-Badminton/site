---
layout: page
title: Competition
keyword: Rec Badminton Compétition Rennes
description: Compétition Badminton
author: Rec Badminton
permalink: "/competition/"

---
<section class="competition container my-5">

  <nav class="page-summary mb-5" aria-label="Sommaire de la page">
    <a href="#tournois">Les tournois</a>
    <a href="#interclubs">Les interclubs</a>
    {% if site.data.interclubs.home_matches.size > 0 %}<a href="#prochaines-rencontres">Prochaines rencontres</a>{% endif %}
    {% if site.data.interclubs.teams.size > 0 %}<a href="#equipes">Équipe par équipe</a>{% endif %}
    <a href="#bilan">Bilan de la saison</a>
  </nav>

  <h2 id="tournois" class="section-title text-center">{{ site.data.competition.tournaments.title }}</h2>
  <br/>
    <div class="row align-items-center">
      <div class="col-md-8">
        <p>{{ site.data.competition.tournaments.text1 }} <a href="{{ site.data.competition.tournaments.link1 }}" target="_blank" rel="noopener noreferrer">{{ site.data.competition.tournaments.link1 }}</a></p>
        <p>{{ site.data.competition.tournaments.text2 }}</p>
        <a class="link-container" target="_blank" rel="noopener noreferrer" href="{{ site.data.competition.tournaments.link1 }}">{{ site.data.competition.tournaments.button }}</a>
      </div>
      <br/>
      <div class="col-md-4 text-center">
        <img src="{{ site.data.competition.tournaments.image }}" alt="Photo tournoi" class="img-fluid rounded">
        <small class="d-block mt-2">{{ site.data.competition.tournaments.caption }}</small>
      </div>
    </div>
<br/><br/>
  <h2 id="interclubs" class="section-title text-center">{{ site.data.competition.interclubs.title }}</h2>
  <p>{{ site.data.competition.interclubs.text1 }}</p>
  <p>{{ site.data.competition.interclubs.text2 }}</p>
  <p class="text-center my-4">
    <a class="link-container" target="_blank" rel="noopener noreferrer" href="{{ site.data.competition.interclubs.link1 }}">{{ site.data.competition.interclubs.button }}</a>
  </p>

  {% assign upcoming = site.data.interclubs.next_matches %}
  {% if upcoming.size > 0 %}
    <h3 id="prochaines-rencontres" class="text-center mt-5">Nos prochaines rencontres</h3>
    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead>
          <tr>
            <th scope="col" class="text-center">Date</th>
            <th scope="col" class="text-center">Équipe</th>
            <th scope="col" class="text-center">Adversaire</th>
            <th scope="col" class="text-center">Lieu</th>
          </tr>
        </thead>
        <tbody>
          {% for match in upcoming %}
            <tr scope="row">
              <td class="text-center text-nowrap">
                <a href="{{ match.url }}" target="_blank" rel="noopener noreferrer">{{ match.date | date: "%d/%m" }}{% if match.time != "" %} à {{ match.time }}{% endif %}</a>
              </td>
              <td class="text-center text-nowrap">{{ match.team }}<small class="d-block">{{ match.competition }}</small></td>
              <td>{{ match.opponent }}</td>
              <td class="text-center">{% if match.at_home %}Domicile{% else %}Extérieur{% endif %}{% if match.venue != "" %}<small class="d-block">{{ match.venue }}</small>{% endif %}</td>
            </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
    <p class="text-center"><small>Données FFBaD mises à jour le {{ site.data.interclubs.generated_at | date: "%d/%m/%Y" }}.</small></p>
  {% endif %}

  {% assign teams = site.data.interclubs.teams %}
  {% if teams.size > 0 %}
    <h3 id="equipes" class="text-center mt-5">Équipe par équipe</h3>
    <ul class="nav nav-tabs justify-content-center" role="tablist">
      {% for team in teams %}
        <li class="nav-item" role="presentation">
          <button class="nav-link{% if forloop.first %} active{% endif %}" id="tab-{{ forloop.index }}"
                  data-bs-toggle="tab" data-bs-target="#team-{{ forloop.index }}" type="button" role="tab"
                  aria-controls="team-{{ forloop.index }}" aria-selected="{% if forloop.first %}true{% else %}false{% endif %}">
            {{ team.name }}
          </button>
        </li>
      {% endfor %}
    </ul>

    <div class="tab-content pt-4">
      {% for team in teams %}
        <div class="tab-pane fade{% if forloop.first %} show active{% endif %}" id="team-{{ forloop.index }}"
             role="tabpanel" aria-labelledby="tab-{{ forloop.index }}">
          <p class="text-center">
            <a href="{{ team.url }}" target="_blank" rel="noopener noreferrer">{{ team.competition }}</a>
            &mdash; {{ team.rank }}<sup>e</sup>, {{ team.points }} points
          </p>

          <h4>Classement</h4>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="text-center">#</th>
                  <th scope="col">Équipe</th>
                  <th scope="col" class="text-center">J</th>
                  <th scope="col" class="text-center">G</th>
                  <th scope="col" class="text-center">N</th>
                  <th scope="col" class="text-center">P</th>
                  <th scope="col" class="text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {% for line in team.standings %}
                  <tr scope="row"{% if line.is_rec %} class="is-rec"{% endif %}>
                    <td class="text-center">{{ line.rank }}</td>
                    <td>{{ line.team }}</td>
                    <td class="text-center">{{ line.played }}</td>
                    <td class="text-center">{{ line.won }}</td>
                    <td class="text-center">{{ line.drawn }}</td>
                    <td class="text-center">{{ line.lost }}</td>
                    <td class="text-center">{{ line.points }}</td>
                  </tr>
                {% endfor %}
              </tbody>
            </table>
          </div>

          <h4>Calendrier</h4>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" class="text-center">Journée</th>
                  <th scope="col" class="text-center">Date</th>
                  <th scope="col">Adversaire</th>
                  <th scope="col" class="text-center">Lieu</th>
                  <th scope="col" class="text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {% for match in team.matches %}
                  <tr scope="row">
                    <td class="text-center">{{ match.journee }}</td>
                    <td class="text-center text-nowrap">
                      <a href="{{ match.url }}" target="_blank" rel="noopener noreferrer">{{ match.date | date: "%d/%m" }}</a>
                      {% if match.time != "" %}<small class="d-block">{{ match.time }}</small>{% endif %}
                    </td>
                    <td>{{ match.opponent }}</td>
                    <td class="text-center">{% if match.at_home %}Domicile{% else %}Extérieur{% endif %}{% if match.venue != "" %}<small class="d-block">{{ match.venue }}</small>{% endif %}</td>
                    <td class="text-center text-nowrap">{% if match.played %}{{ match.score }}{% else %}&mdash;{% endif %}</td>
                  </tr>
                {% endfor %}
              </tbody>
            </table>
          </div>
        </div>
      {% endfor %}
    </div>
  {% endif %}

  <h3 id="bilan" class="text-center mt-5">{{ site.data.competition.table.title }}</h3>
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
