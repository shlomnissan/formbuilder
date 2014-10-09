<ul id="form-elements" style="display: none">

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

    <button id="save" class="button success">{localize_i18n.buttons.save}</button>