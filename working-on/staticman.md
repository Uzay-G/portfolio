## Staticman
![staticman](https://raw.githubusercontent.com/eduardoboucas/staticman/master/logo.png)

<a href="https://staticman.net" target="_blank" rel="noopener">Staticman</a> is a free and open source solution to add comments to your static site. Setting this one up is a bit more complicated than the others but it's a well-designed tool. This part will be specific to **Jekyll users**.

Steps:
1. Add the <a href="https://github.com/apps/staticman-net" target="_blank" rel="noopener">Static Man app</a> to your Github repository.
2. Go to the following url to make staticman accept your invite: <code>https://api.staticman.net/v2/connect/{username}/{repository name}
3. In your repo settings > Webhooks add <code>https://api.staticman.net/v1/webhook</code> with content type <code>application/json</code> and the <code>Pull Request</code> event.
4. Add the following staticman.yml file to your blog root:
<pre><code>comments:
  # Names of the fields comments form is allowed to submit. If a field that is
  # not here is part of the request, an error will be thrown.
  allowedFields: ["name", "url", "message"]

  branch: "master"

  # Text to use as the commit message or pull request title. Accepts placeholders.
  commitMessage: "Add Staticman data"

  # Name of comments files
  filename: "post{@timestamp}"

  format: "yaml"

  generatedFields:
    date:
      type: date
      options:
        format: "timestamp-seconds"

  # Whether entries need to be appproved before they are published to the main
  # branch. If set to `true`, a pull request will be created for your approval.
  # Otherwise, entries will be published to the main branch automatically.
  moderation: false

  # Name of the site. Used in notification emails.
  name: "example.com"

  # Folder where comments will be stored
  path: "_data/comments"

  # Names of required fields. If any of these isn't in the request or is empty,
  # an error will be thrown.
  requiredFields: ["name", "message"]

</code></pre>
This gives additional instruction to staticman on how to manage our comments.
All you need to change is the name, which needs to be set to your website url. You can learn more about configuration <a href="https://staticman.net/configuration" target="_blank" rel="noopener">here</a>

5. Create a commenting form that you'll add to the bottom of your posts:
<pre><code class="html">&#60;form method="POST" action="https://api.staticman.net/v2/entry/{github-username/blog-repo/master/comments">
  &#60;input name="options[redirect]" type="hidden" value="https://my-site.com">
  &#60;h3>Submit a comment&#60;/h3>
  &#60;label>&#60;input name="fields[name]" type="text">Name&#60;/label>
  &#60;label>&#60;textarea name="fields[message]">&#60;/textarea>Message&#60;/label>
  
  &#60;button type="submit">Submit&#60;/button>
&#60;/form>
</code></pre>
This form collects the comments and relays them to the staticman api. Change the value of the first <code>input</code> to your website url.

6. Display comments on posts with this Jekyll snippet:
<pre><code class="html">&#123;% assign comments = site.data.comments | where:'post', page.slug %}
&#123;% assign commentCount = comments | size %}

&#123;% if commentCount > 0 %}
    &#60;h3>Comments&#60;/h3>
    &#60;ul>
    &#123;% for comment in comments %}
    &#60;li>
    &#60;p>&#60;b>&#123;&#123; comment.comment }}/5&#60;/b>  by &#60;b>{{ comment.name }}&#60;/b> on &#60;i>&#123;&#123; comment.date | date: '%B %d, %Y' }}&#60;/i>&#60;/p>
&#123;% if comment.message %}
    &#60;p>
        &#123;&#123;comment.message}}
    &#60;/p>
    &#123;% endif %}
    &#60;li>
    &#123;% endfor %}
    &#60;/ul>
&#123;% endif %}
</code></pre>
In this snippet, the <code>assigns</code> command gets all the site comments whose page corresponds to that of the post and displays them. 

Your site should now be all set with the comment functionality!
