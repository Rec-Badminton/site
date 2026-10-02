---

Rec Badminton Website [Jekyll]

---



## Running the site locally with Docker

The site runs inside a Docker container, so **no local Ruby installation is
required** — only Docker.

```bash
make serve     # http://localhost:4001
```

Other available targets:

| Command        | Effect                                     |
| -------------- | ------------------------------------------ |
| `make help`    | List the available targets                 |
| `make install` | Install the gems into `./vendor/bundle`    |
| `make build`   | Build the site into `./_site`              |
| `make clean`   | Remove the generated site and the caches   |

The port can be overridden: `make serve PORT=4002`.

[_config.dev.yml](_config.dev.yml) neutralizes the production `baseurl` (an
absolute URL) so that links and assets resolve correctly when serving locally.

## Using Jekyll locally (without Docker)

To work locally with this project, you'll have to follow the steps below:

1. Fork, clone or download this project
1. [Install][] Jekyll en utilisant [Ruby][] Ruby 2
1. Download dependencies: `bundle`
1. Build and preview: `bundle exec jekyll serve`
1. Add content

The above commands should be executed from the root directory of this project.

Read more at Jekyll's [documentation][].

[Jekyll]: http://jekyllrb.com/
[install]: https://jekyllrb.com/docs/installation/
[documentation]: https://jekyllrb.com/docs/home/
[Ruby]: https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-2.7.6-1/rubyinstaller-devkit-2.7.6-1-x64.exe
