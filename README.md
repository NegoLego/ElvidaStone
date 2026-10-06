# ElvidaStone

Production website built for a friend, now deployed on Cloudflare Pages.

🔗 **Live website:** **https://elvidastone.pages.dev**

## Quick Content Table

- [Project Structure](#project-structure)
- [Overview](#overview)
- [Admin View](#admin-view)
- [Live Website](#live-website)

## Project Structure

```text
/
├── src/                # Astro source
│   ├── components/     # UI blocks
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes
│   ├── types/          # Type definitions
│   └── utils/          # Helpers
├── public/             # Static assets
│   └── admin/          # Decap CMS
├── data/               # Content data
├── functions/          # Auth endpoints
├── astro.config.mjs    # Astro config
└── package.json        # Dependencies/scripts
```

## Overview

This website originally started as a classical PHP site. After reviewing the project needs, I identified that the previous infrastructure was unnecessary and migrated it to **Astro**.

The result is a faster site thanks to static generation, easy route creation through Astro pages, and smooth integration with **Cloudflare Pages** and **Decap CMS**.

The admin side is also secure through **GitHub authentication**.

## Admin View

What the administrator sees in Decap CMS:

![Administrator Decap CMS view](https://github.com/user-attachments/assets/6854e5bf-9a86-40eb-9b13-7ca33b83983d)

## Live Website

Visit: **https://elvidastone.pages.dev**
