// Run once per user-visible release: node release-version.cjs YYYYMMDD
const fs=require('fs'),path=require('path'),root=fs.existsSync(path.join(__dirname,'dist'))?path.join(__dirname,'dist'):__dirname;
const info=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8')),previous=info.version,[major,minor]=previous.split('.').map(Number),next=major+'.'+(minor+1),date=process.argv[2]||new Date().toISOString().slice(0,10).replaceAll('-',''),build=next+'.'+date+'.1';
for(const file of ['index.html','updates.js','sw.js']){const p=path.join(root,file);let text=fs.readFileSync(p,'utf8');text=text.replaceAll(info.build,build).replaceAll('8s2 Neon Bubble v'+previous,'8s2 Neon Bubble v'+next);fs.writeFileSync(p,text)}
fs.writeFileSync(path.join(root,'version.json'),JSON.stringify({version:next,build}));console.log(JSON.stringify({previous,version:next,build}));
