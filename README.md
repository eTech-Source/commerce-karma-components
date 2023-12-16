# Commerce Karma Components

Commerce Karma components allow you to embed the functionality of Commerce Karma in your application while still being able to add your own custom styling and being able to place them anywhere. These components work on all main stream JavaScript frameworks.

## Installation

### Automatic Installation (Recommended)

Insert a script tag into the `head` or the end of the `body` tag of your HTML markup:

```
<script src="https://cdn.jsdelivr.net/ADD ASAP"></script>
```

### Manual Installation

Clone this repository into to the root directory of your project project by running:

```
git clone https://github.com/eTech-Source/commerce-karma-components.git
```

Then add the same script tag anywhere you want to use these components:

```
<script src="/commerce-karma-components/script.js"></script>
```

**Note:** This approach is not recommended unless you need to modify the source code or change or any of the assets like the stars images. This option is not required to change the styles of the components. However, it does allow for full on premise hosting.

## Usage

Currently nothing will render. This because you have not selected where you want your components to go. Start by placing a `div` tag with an id of the component name you want to render. For example:

```
<!--Your other HTML markup-->
<div id="CK-users"></div>
```

All id's and classes used by the component will need to be prefixed with `CK-`.

Still nothing will appear will appear. Each component has a corresponding function required to render it. For example:

```
document.addEventListener("DOMContentLoaded", async () => {
  const users = await injectUser();
});
```

It is recommended to wrap the function in a `DOMContentLoaded` event listener.

There is still one more thing to do. Currently the application has not been authorized. Simply embed the sign in components. Into your project by adding a check authentication call. For instance:

```
document.addEventListener("DOMContentLoaded", async () => {
  const users = await injectUser();
  injectSearch ();
  checkAuth (users)
});
```

Note that `users` or review component is required on the same page in order to render the sign in component. All done! You have added your first component to your application.

Here is a short list of all the components:

### Reviews Component
Renders a review written by a user of Commerce Karma.

#### Basic Usage

Add a `div` tag to your project with an id called `CK-reviews`. 

```
<div id="CK-reviews"></div>
```

Then call the `injectReview` function. 

```
document.addEventListener("DOMContentLoaded", async () => {
  const reviews = await injectReviews();
});
```

#### Function Arguments

This function takes no arguments.

#### Styling

- **ID** `CK-reviews` The parent element for all reviews to be rendered in.
- **Class** `CK-review` An individual review.
- **Class** `CK-review-title` The title of a review' child of `CK-review`.
- **Class** `Ck-review-text` The content of a review; child of `Ck-review`.


#### Built in functionality

When the `CK-id` query parameter is present all reviews with that author and all users with that id will be rendered. 

### Search Component

Search Commerce Karma users.

#### Basic Usage

Add a `div` tag to your project with an id called `CK-search`. 

```
<div id="CK-search"></div>
```

Then call the `injectSearch` function. 

```
document.addEventListener("DOMContentLoaded", async () => {
  const reviews = await injectUsers();
});
```

#### Function Arguments

This function takes no arguments.

#### Styling

- **ID** `CK-search` The parent element for the search box.
- **ID** `CK-search-bar` The input element for the search.
- **ID** `CK-search-options` Search by category dropdown.
- **ID** `CK-option` Individual option for search category dropdown; child of `CK-search-options`

#### Built in functionality

On search filter query parameters are added to the url.

### Users Component

Display a Commerce Karma user.

#### Basic Usage

Add a `div` tag to your project with an id called `CK-users`. 

```
<div id="CK-users"></div>
```

Then call the `injectUsers` function. 

```
document.addEventListener("DOMContentLoaded", async () => {
  const reviews = await injectUsers();
});
```

#### Function Arguments

- **Optional** `link` When specified changes the location redirected to. It is recommended to set this to a the route a user profile is on. If this isn't specified the user will be redirected to `/`.
- **Optional** `filters` Filter user based on a number of properties here a few:
    - `_id` The mongoDB id of the user.
    - `userId` The clerk.js user id of the user.
    - `name` The user's name.
    - `email` The user's email address.
    - `phone` The user's phone number.
    - `customerRating` The user's rating.
    - `city` The user's city.

   If there are any filters in query params manual passed in filters will override them. Defaults to `{}`.

#### Styling

- **ID** `CK-users` The parent element in which all users are rendered.
- **Class** `CK-user` A single user; child of `CK-users`
- **Class** `CK-user-link` A link to the user's profile; child of `CK-user`
- **Class** `CK-user-name` The user's name; child of `CK-user-link`
- **Class** `CK-stars` The amount of overall stars the user has; child of `CK-user-link`
- **Class** `CK-profile-picture` The user's profile picture; child of `CK-user-link`

#### Built in functionality


### Sign In Component

If the user is not signed in displays a sign in component.

#### Basic Usage

Add a `div` tag to your project with an id called `CK-signin`. 

```
<div id="CK-signin"></div>
```

Then call the `checkAuth` function. 

```
document.addEventListener("DOMContentLoaded", async () => {
  const users = await injectUser();
  checkAuth (users)
});
```

#### Function Arguments

**Note:** It is required that one of these arguments is passed.

- `review` The review object from `injectReview`.
- `user` The user object from `injectUser`.


#### Styling

- **ID** `CK-signin` The parent element of which the sign in markup is conditional rendered.
- **ID** `CK-signin-heading` The "Sign In" heading; child of `CK-signin`
- **ID** `CK-signin-message` The message telling the user what Commerce Karma is; child of `CK-signin`
- **ID** `CK-signin-btn` The button for signing in; child of `CK-signin`
- **ID** `CK-signin-link` The link to the sign in page; child of `CK-signin-btn`

#### Built in functionality

None.

## Usage With Other React.js

This library requires the `document` and `window` API.