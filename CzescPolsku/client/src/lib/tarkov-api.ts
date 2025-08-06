import { 
  TarkovAPIQuest,
  TarkovAPIMap,
  TarkovAPIItem 
} from "@/types/tarkov";

const TARKOV_API_URL = 'https://api.tarkov.dev/graphql';

export async function getTarkovQuests(): Promise<TarkovAPIQuest[]> {
  const query = `
    query {
      tasks {
        id
        name
        trader {
          name
        }
        wikiLink
        taskRequirements {
          task {
            id
            name
          }
          status
        }
      }
    }
  `;

  try {
    console.log('Fetching Tarkov quests from API...');
    
    const response = await fetch(TARKOV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'TarkovApp/1.0'
      },
      body: JSON.stringify({ query }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText.substring(0, 200) + '...');

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was not JSON:', responseText.substring(0, 500));
      throw new Error('API returned non-JSON response');
    }

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    console.log('Successfully fetched', data.data?.tasks?.length || 0, 'quests');
    return data.data?.tasks || [];
  } catch (error) {
    console.error('Error fetching Tarkov quests:', error);
    throw error; // Re-throw to see the actual error in the UI
  }
}

export async function getTarkovMaps(): Promise<TarkovAPIMap[]> {
  const query = `
    query {
      maps {
        id
        name
        normalizedName
        description
        enemies
        raidDuration
      }
    }
  `;

  try {
    const response = await fetch(TARKOV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'TarkovApp/1.0'
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data?.maps || [];
  } catch (error) {
    console.error('Error fetching Tarkov maps:', error);
    return [];
  }
}

export async function getTarkovItems(name?: string): Promise<TarkovAPIItem[]> {
  const query = `
    query ${name ? '($name: String!)' : ''} {
      items${name ? '(name: $name)' : ''} {
        id
        name
        shortName
        description
        iconLink
        avg24hPrice
        basePrice
        width
        height
        types
        sellFor {
          source
          price
          currency
        }
      }
    }
  `;

  try {
    const response = await fetch(TARKOV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'TarkovApp/1.0'
      },
      body: JSON.stringify({ 
        query,
        variables: name ? { name } : undefined
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data?.items || [];
  } catch (error) {
    console.error('Error fetching Tarkov items:', error);
    return [];
  }
}

export async function syncQuestsWithAPI(): Promise<void> {
  try {
    const response = await fetch('/api/sync/quests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Quests synced:', result);
  } catch (error) {
    console.error('Error syncing quests:', error);
    throw error;
  }
}