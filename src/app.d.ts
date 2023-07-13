// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}


declare global {
  interface Window{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any
  }
}

export {};
