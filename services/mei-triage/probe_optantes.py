# Diagnostic only. Official automation disabled after explicit CAPTCHA refusal on 2026-10-29. Do not schedule or retry.
import asyncio,json,pathlib
from playwright.async_api import async_playwright
async def main():
 out={}
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,chromium_sandbox=True)
  page=await b.new_page()
  await page.goto('https://consopt.www8.receita.fazenda.gov.br/consultaoptantes',wait_until='domcontentloaded',timeout=30000)
  await page.locator('#Cnpj').fill('62560654000127')
  await page.locator('button[data-sitekey]').click(timeout=10000)
  await page.wait_for_timeout(7000)
  out={'url':page.url,'text':(await page.locator('body').inner_text())[:6000],'frames':[f.url for f in page.frames if 'captcha' in f.url]}
  await page.screenshot(path='/var/lib/nacional-mei/probe.png')
  await b.close()
 pathlib.Path('/var/lib/nacional-mei/probe.json').write_text(json.dumps(out))
asyncio.run(main())
