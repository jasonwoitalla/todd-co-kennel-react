const API_URL: string = process.env.WORDPRESS_API_URL

async function fetchApi(query: string = '', { variables }: Record<string, any> = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORDPRESS_API_TOKEN}`
    }

    const res = await fetch(API_URL, {
        headers,
        method: 'POST',
        body: JSON.stringify({
            query,
            variables
        }),
    });

    const json = await res.json();
    if(json.errors) {
        console.error(json.errors);
        throw new Error("Faild to fetch data from wordpress");
    }

    return json.data;
}

export async function getSiteMetadata(): Promise<Record<string, string>> {
    const data = await fetchApi(`
        query GetMetadata {
            generalSettings {
                title
                url
                description
            }
        }`);

    console.log("Metadata: " + JSON.stringify(data?.generalSettings));
    return data?.generalSettings;
}

export interface MenuItem {
    path: string;
    id: string;
    label: string;
};

export async function getMenuItems(): Promise<MenuItem[]> {
    const data = await fetchApi(`
        query GetHeaderMenu {
            menuItems {
            nodes {
                path
                id
                label
            }
            }
        }`
    );

    console.log("Menu items from wordpress: " + JSON.stringify(data.menuItems.nodes));
    return data.menuItems.nodes;
}

export async function getPageContent(uri: string): Promise<string> {
    const data = await fetchApi(`
        query PageContent($uri: String) {
            pageBy(uri: $uri) {
                content
            }
        }`, 
        {
            variables: { uri },
        }
    );

    console.log("Content: " + JSON.stringify(data));
    return data.pageBy.content;
}
