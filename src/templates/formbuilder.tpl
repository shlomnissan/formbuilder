<div class="container form-container">

  <div class="left-col" id="toolbox-col" style="padding-top: 37px">

    <ul class="nav-tabs" role="tablist">
      <li class="active toolbox-tab" data-target="#add-field">Add a Field</li>
      <li class="toolbox-tab" data-target="#field-settings">Field Settings</li>
      <li class="toolbox-tab" data-target="#form-settings">Form Settings</li>
    </ul>

    <div class="tab-content">

      <div class="tab-pane active" style="padding: 20px;" id="add-field">

        <div class="col-sm-6">
          <button class="button new-element" data-type="element-single-line-text" style="width: 100%;">Single Line Text</button>
          <button class="button new-element" data-type="element-paragraph-text" style="width: 100%;">Paragraph Text</button>
          <button class="button new-element" data-type="element-checkboxes" style="width: 100%;">Checkboxes</button>
        </div>

        <div class="col-sm-6">
          <button class="button new-element" data-type="element-number" style="width: 100%;">Number</button>
          <button class="button new-element" data-type="element-multiple-choice" style="width: 100%;">Multiple Choice</button>
        </div>

      </div>

      <div class="tab-pane" id="field-settings" style="padding: 20px;">

        <div class="section">
          <div class="form-group">
            <label>Field Label</label>
            <input type="text" class="form-control" id="field-label" value="Untitled" />
          </div>
        </div>

         <div class="section" id="field-choices" style="display: none;">
       
          <div class="form-group">
              <label>Choices</label>
          </div>

        </div>

        <div class="section">
        <div class="form-group">
            <label>Field Options</label>
        </div>

        <div class="field-options">
            <div class="checkbox">
              <label>
                <input type="checkbox" id="required">Required
              </label>
            </div>
          </div>
        </div>

        <button class="button danger" id="control-remove-field">Remove</button>&nbsp;
        <button class="button" id="control-add-field">Add Field</button>

      </div>

      <div class="tab-pane" id="form-settings" style="padding: 20px;">

        {#form}
        <div class="section">
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="bind-control form-control" data-bind="#form-title-label" id="form-title" value="{title}" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea class="bind-control form-control" data-bind="#form-description-label" id="form-description">{description}</textarea>
          </div>
        </div>
        {/form}

      </div>

    </div>

  </div>

  <div class="right-col" id="form-col">

    <ul id="form-elements">

      {#form}
      <li class="form-element" id="form-settings-element" data-type="form-settings">
        <h2 id="form-title-label">{title}</h2>
        <h5 id="form-description-label">{description}</h5>
      </li>

        <ul id="sortable-elements">

          {#fields}

            <!-- Single Line Text -->

            {@eq key="{type}" value="element-single-line-text"} 


              <li class="form-element {#required}required{/required}" id="element-{position}" data-label="{title}" data-position="{position}" data-type="element-single-line-text">
                <label>
                  <span class="label-title">{title}</span>
                  {#required}<span class="required-star"> *</span>{/required}
                </label>
                <input type="text" class="form-control" value="" disabled />
              </li>

            {/eq}


            <!-- Number -->

            {@eq key="{type}" value="element-number"} 

              <li class="form-element {#required}required{/required}" id="element-{position}" data-label="{title}" data-position="{position}" data-type="element-number">
                <label>
                  <span class="label-title">{title}</span>
                  {#required}<span class="required-star"> *</span>{/required}
                </label>
                <input type="number" class="form-control" value="" disabled />
              </li>

            {/eq}

            <!-- Paragraph Text -->

            {@eq key="{type}" value="element-paragraph-text"} 

            <li class="form-element {#required}required{/required}" id="element-{position}" data-label="{title}" data-position="{position}" data-type="element-paragraph-text">
              <label>
                <span class="label-title">{title}</span>
                {#required}<span class="required-star"> *</span>{/required}
              </label>
              <textarea disabled></textarea>
            </li>

            {/eq}

            <!-- Multiple-Choice -->

            {@eq key="{type}" value="element-multiple-choice"}

              <li class="form-element {#required}required{/required}" id="element-{position}" data-label="{title}" data-position="{position}" data-type="element-multiple-choice">

                <label>
                  <span class="label-title">{title}</span>
                  {#required}<span class="required-star"> *</span>{/required}
                </label>

                <div class="choices" data-type="settings-choice-radio">

                  {#choices}

                    <div class="choice radio disabled">
                      <label>
                        <input type="radio" class="option-{@idx}{.}{/idx}" name="element-{position}-choice" value="{value}" {#checked}checked{/checked} disabled>
                        <span class="choice-label">{title}</span>
                      </label>
                    </div>

                  {/choices}

                </div>

              </li>

            {/eq}

          {/fields}

        </ul>

      {/form}

    </ul>

    <button id="save" class="button success">Save Form</button>

  </div>

  <div style="clear: both"></div>

</div> <!-- /container -->