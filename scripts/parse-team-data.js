const fs = require('fs');
const path = require('path');

const HTML_FILE_PATH = 'C:/Users/vikur/.gemini/antigravity/brain/87c416f2-56ac-4ca8-8341-df2047d70654/.system_generated/steps/10/content.md';
const OUTPUT_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'team.json');

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}

function main() {
  console.log(`Reading HTML content from: ${HTML_FILE_PATH}`);
  if (!fs.existsSync(HTML_FILE_PATH)) {
    console.error(`HTML file does not exist at ${HTML_FILE_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(HTML_FILE_PATH, 'utf-8');
  
  // Find the team grid section
  const teamSectionMatch = content.match(/<div class="team-grid">([\s\S]*?)<\/section>/i);
  if (!teamSectionMatch) {
    console.error('Could not find team-grid section in HTML content.');
    process.exit(1);
  }

  const teamGridHtml = teamSectionMatch[1];
  
  // Split by card container
  const cards = teamGridHtml.split(/<div class="team-card-sq/g).slice(1);
  console.log(`Found ${cards.length} card sections in HTML.`);

  const teamData = [];

  for (let i = 0; i < cards.length; i++) {
    const cardHtml = cards[i];
    
    // Check if ex-employee card
    const isExEmployee = cardHtml.split('>')[0].includes('ex-employee-card');

    // Extract attributes from team-member-name-clickable div
    const nameDivMatch = cardHtml.match(/<div class="team-member-name team-member-name-clickable"([\s\S]*?)>/i);
    if (!nameDivMatch) {
      console.warn(`Skipping card ${i} because team-member-name div was not found.`);
      continue;
    }

    const attrsText = nameDivMatch[1];
    
    const getAttr = (attr) => {
      const regex = new RegExp(`${attr}=["']([\\s\\S]*?)["']`, 'i');
      const m = attrsText.match(regex);
      return m ? decodeHtmlEntities(m[1].trim()) : '';
    };

    const id = parseInt(getAttr('data-member-id')) || i + 1;
    const name = getAttr('data-member-name');
    const role = getAttr('data-member-role');
    const image = getAttr('data-member-image');
    const bio = getAttr('data-member-bio') || getAttr('data-member-qualifications');
    const education = getAttr('data-member-education');
    const experience = getAttr('data-member-experience');

    // Extract social links from team-social-links section
    const socialBlockMatch = cardHtml.match(/<div class="team-social-links">([\s\S]*?)<\/div>/i);
    const socials = {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    };

    if (socialBlockMatch) {
      const socialLinksHtml = socialBlockMatch[1];
      const linkRegex = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(socialLinksHtml)) !== null) {
        const href = decodeHtmlEntities(linkMatch[1].trim());
        const iconHtml = linkMatch[2];
        
        if (iconHtml.includes('facebook') || href.includes('facebook.com')) {
          socials.facebook = href;
        } else if (iconHtml.includes('instagram') || href.includes('instagram.com')) {
          socials.instagram = href;
        } else if (iconHtml.includes('linkedin') || href.includes('linkedin.com')) {
          socials.linkedin = href;
        } else if (iconHtml.includes('twitter') || iconHtml.includes('fa-twitter') || href.includes('twitter.com') || href.includes('x.com')) {
          socials.twitter = href;
        }
      }
    }

    teamData.push({
      id,
      name,
      role,
      image,
      bio,
      education,
      experience,
      isExEmployee,
      socials
    });
  }

  // Create data directory if it doesn't exist
  fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(teamData, null, 2), 'utf-8');
  console.log(`Successfully parsed ${teamData.length} team members and saved to ${OUTPUT_JSON_PATH}`);
}

main();
