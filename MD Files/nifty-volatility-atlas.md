# Nifty Trader Pro (Volatility Atlas)

## TL;DR
I built an interactive dashboard that answers one question with real data instead of gut feeling: how often does the Nifty 50 make a big move, and is that risk actually higher around options expiry?

## The Problem
I was trading Nifty index options, specifically selling options roughly 2% out-of-the-money on expiry day, betting they'd expire worthless. It felt like a "safe" trade — 2% is a big move for a single day, right? But I didn't actually know how often Nifty moves 2% in a day, and I definitely didn't know whether that probability changes as expiry approaches. I wanted an honest answer before I kept sizing trades around an assumption.

## What I Built
Instead of eyeballing a few months of charts, I pulled the Nifty 50's entire daily trading history back to 2008 and built a dashboard to slice it every way that mattered for this question. You can drag a slider to define what counts as a "big move" (I mostly used 2%), filter by direction (up only / down only / both), pick a year range, and instantly see how often that kind of move happens — overall, overnight, and specifically in the days leading up to expiry.

The dashboard breaks days down by how many days they sat before expiry (10+ days, down to expiry day itself), by month (some months are noticeably more volatile than others), and by whether big moves skew toward puts or calls near expiry. It also shows what tends to happen the day *after* a big move, which turned out to be its own interesting rabbit hole.

## How It Works
Everything the dashboard shows comes from one API call. The frontend loads, hits `/api/data`, and gets back every trading day since 2008 tagged with its return, gap, intraday move, days-to-expiry, and expiry classification. From there, all the filtering (move size, direction, year range, % vs. raw count) happens client-side against that dataset — so once it's loaded, switching the slider or toggling "up only" is instant, no server round-trip.

Under the hood, a separate offline pipeline does the heavy lifting: pull raw OHLCV data, compute derived stats, tag every day with its market-structure context, and load it all into a database the API reads from.

## Tech Stack
- **Data collection**: Python, `yfinance` (Nifty 50 historical OHLCV data)
- **Data processing**: `pandas` for returns/gap/intraday calculations, `pandas_market_calendars` for NSE trading-day and holiday data
- **Database**: PostgreSQL, loaded via `psycopg2`
- **Backend**: Flask API serving aggregated data as JSON
- **Frontend**: Vanilla HTML/CSS/JS — no framework, no build step
- **Hosting**: Render

## Architecture & Key Technical Decisions
The pipeline is three distinct stages, each its own script, which made debugging much easier than one monolithic script would have:

1. **`generate_data.py`** — downloads raw price data and computes every derived field: close-to-close return, overnight gap, intraday move, day range, next-day return, and a bucket label (e.g. "+2–3%"). This is also where the expiry logic lives.
2. **`load_to_postgres.py`** — takes the generated data and bulk-loads it into a `nifty50` table using `execute_values` for efficient batch inserts.
3. **`app.py`** — a small Flask API that queries Postgres, groups results by year, and computes summary stats (big-move counts, expiry-week counts, etc.) before returning JSON to the frontend.

I originally prototyped this against a flat `data.json` file (you can still see that path in the code), then migrated to Postgres specifically to get hands-on practice with SQL — this project was as much a database-learning exercise as a trading-research one. The `app.py` grouping logic deliberately mirrors the shape of the old `data.json` output so the frontend needed almost no changes when the backend swapped.

The trickiest part by far was the expiry-date calendar logic. Nifty's monthly and weekly options expiry isn't just "the last Thursday of the month" — it has to account for:
- Holidays shifting expiry to the previous trading day
- Weekly options not existing before February 2019
- SEBI's September 2025 rule change moving the standard expiry day from **Thursday to Tuesday**

I built `get_monthly_expiry()` and `get_weekly_expiry()` to walk backward from the theoretical expiry date to the nearest actual NSE trading day, using a real NSE trading-day calendar (`pandas_market_calendars`) rather than assuming every weekday is a trading day. Every row in the dataset is then tagged with `dte_monthly`, `dte_weekly`, `is_expiry_week`, and `expiry_regime` (thursday/tuesday), which is what lets the dashboard filter cleanly across a rule change that happened mid-dataset.

## Challenges & Solutions
- **Getting the expiry calendar right across a regime change.** The Thursday→Tuesday switch meant I couldn't hardcode a single weekday. I solved this by branching on the switch date and always validating the computed expiry against the actual NSE holiday calendar rather than a fixed weekday assumption.
- **Learning SQL/Postgres from scratch mid-project.** This was new territory for me. Moving from a JSON file to a real relational database meant thinking properly about schema design, batch inserts, and writing aggregation queries (grouping by year, filtering by threshold) that used to just be Python list comprehensions.
- **Keeping the frontend API-agnostic.** Because I designed the Flask endpoint to return data shaped identically to the original `data.json`, I could swap the entire backend from a static file to a live database without touching the dashboard's JavaScript.

## Results / Impact
The numbers ended up mattering more than I expected. Across the full 2008–2026 dataset, the Nifty 50 moves ≥2% in a day about 8.3% of the time — but of those big moves, roughly a quarter happen during expiry week, and within expiry week, big moves lean noticeably toward the downside (about 56% falls vs. 44% rises). In other words, the "safe" trade I set out to test — selling options ~2% OTM near expiry — carries more tail risk than it feels like at a glance, especially on the put side. I haven't changed how I actually trade based on this yet, but I now have real numbers instead of a hunch, which was the whole point of building this.

## Links
- GitHub: https://github.com/Gautam-Kumaran/Nifty50-Returns-analysis
- Live site: https://nifty50-returns-analysis.onrender.com/
