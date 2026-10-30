# murmur landing page

A minimal, responsive concept landing page for a phone-based haptic app inspired by Sensate and BetterSleep. Its ten-second sample pairs changing phone vibrations with an original 147 Hz sine tone whose quick attack and gradual decay suggest a tuning fork. Headphones are optional. On browsers without vibration support, the sound and visual sample can still play.

The vibration pattern suggests Sensate's track-dependent feel; it is not a copy of Sensate's low-frequency waveform. BetterSleep inspired the idea of including sound, but Murmur generates its own 147 Hz tone and does not use BetterSleep audio. The frequency label describes the sound, not a claim that it is medically optimal or that BetterSleep uses it.

Open `public/index.html` directly, or run a local server from the project root:

```sh
python3 -m http.server 4173 --directory public
```

Then visit `http://localhost:4173`.

The app name and pricing are concept placeholders. The Sensate hardware price shown on the page is sourced from its [official US product listing](https://us.getsensate.com/products/sensate) as checked on October 28, 2026. Murmur is independent and uses phone haptics rather than Sensate’s dedicated low-frequency hardware. The page includes a chest-placement caution based on [FDA guidance for implanted medical devices](https://www.fda.gov/radiation-emitting-products/cell-phones/magnets-cell-phones-and-smart-watches-may-affect-pacemakers-and-other-implanted-medical-devices).

The inspiration strip uses the current app icons from the [Sensate App Store listing](https://apps.apple.com/us/app/sensate-stress-anxiety-relief/id1225801099) and [BetterSleep App Store listing](https://apps.apple.com/us/app/bettersleep-relax-and-sleep/id314498713), retrieved through Apple's iTunes Lookup API on October 29, 2026. The Murmur icon is an original pulse and resonance design in `public/murmur-mark.svg` and is also used as the favicon. Showing the source icons explains the concept; it does not imply affiliation or endorsement.

## Waitlist

The email form sends submissions to Formspree. To see signups, sign in as the account owner and open [Murmur waitlist submissions](https://formspree.io/forms/mljjwwva/submissions). Notification settings for that form are in Formspree. The site does not store email addresses in GitHub Pages.

GitHub Pages publishes the `docs/` copy of `public/`. After editing the site, sync with `cp -R public/. docs/` before pushing changes. The `docs/.nojekyll` file keeps GitHub Pages from processing the static files as Jekyll content.
