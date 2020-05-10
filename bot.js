const Discord = require("discord.js");
const fetch = require("node-fetch");

const client = new Discord.Client();

const config = require("./config.json");
const token_config = require("./token.json");

const prefix = config.prefix;
const token = token_config.token;
const theme = config.theme;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.content.startsWith(`${prefix}world`)) {
    let response = await fetch("https://api.covid19api.com/summary");
    let data = await response.json();
    let worldInfoEmbed = new Discord.MessageEmbed()
      .setColor(theme)
      .setTitle(":earth_asia: World Statistics for Covid-19: ")
      .setDescription("Global statistics for Covid-19")
      .addField(
        "Confirmed Cases :mask:",
        data["Global"].TotalConfirmed.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
      )
      .addField(
        "Total Recovered :green_heart:",
        data["Global"].TotalRecovered.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
      )
      .addField(
        "Total Deaths :skull:",
        data["Global"].TotalDeaths.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
      )
      .addField("API: ", "https://api.covid19api.com/")
      .setTimestamp()
      .setFooter("Covid19Stats");

    msg.channel.send(worldInfoEmbed);
  } else if (msg.content.startsWith(`${prefix}stats`)) {
    let country = msg.content.slice(7).replace(" ", "-").toLowerCase();

    let response = await fetch("https://api.covid19api.com/summary");
    let data = await response.json();

    let countryData = {};

    let countryFound = false;

    let countries = data["Countries"];
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].Slug == country) {
        countryData = countries[i];
        countryFound = true;
      } else if (countries[i].CountryCode.toLowerCase() == country) {
        countryData = countries[i];
        countryFound = true;
      }
    }
    if (countryFound == false) {
      msg.channel.send(`Error: Could not find statistics on ${country}`);
    }

    let countryCode = countryData.CountryCode.toLowerCase();

    let countryInfoEmbed = new Discord.MessageEmbed()
      .setColor(theme)
      .setTitle(
        `:flag_${countryCode}: Covid-19 Statistics for ${countryData.Country}: `
      )
      .setDescription(`Statistics for Covid-19 in ${countryData.Country}`)
      .addField(
        "Confirmed Cases :mask:",
        `
        ${countryData.TotalConfirmed.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )}`
      )
      .addField(
        "Total Recovered :green_heart:",
        `
        ${countryData.TotalRecovered.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )}`
      )
      .addField(
        "Total Deaths :skull:",
        `
        ${countryData.TotalDeaths.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )}`
      )
      .addField("API: ", "https://api.covid19api.com/")
      .setTimestamp()
      .setFooter("Covid19Stats");

    msg.channel.send(countryInfoEmbed);
  }
});

client.login(token);
