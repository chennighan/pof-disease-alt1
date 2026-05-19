# PoF Disease Answers for Alt1

An Alt1 helper for RuneScape 3 Player-Owned Farm disease diagnosis.

## What it does

- Watches/scans the RuneScape chat/dialog area after you click animal checks like **Check head**.
- Uses Alt1 pixel/font reading to pull visible text from the RS client.
- Matches detected symptom text to the likely Player-Owned Farm disease.
- Does not click, type, inject inputs, or automate gameplay.

## Install URL

If this is hosted on GitHub Pages, install with:

```text
alt1://addapp/https://YOUR_USERNAME.github.io/YOUR_REPO/appconfig.json
```

If the files are nested inside a folder, include that folder in the URL:

```text
alt1://addapp/https://YOUR_USERNAME.github.io/YOUR_REPO/pof-disease-alt1/appconfig.json
```

## Usage

1. Install the app in Alt1 and grant pixel/gamestate/overlay permissions.
2. Open the app overlay.
3. Click **Start watching**.
4. In RuneScape, inspect the sick animal and click options like **Check head**, **Check body**, **Check feet**, etc.
5. The app scans the visible chat/dialog text and gives the matching disease.

If the app does not read anything, open **Scan box tuning** and adjust the X/Y/W/H values. The default area is the lower-left of the RuneScape client because that is where chat/dialog text usually appears, but custom layouts may need tuning.
