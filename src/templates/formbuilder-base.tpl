<div id="master-container">
  <div id="form-container">
    <div class="container" id="tabs-container">

      <div class="left-col" id="toolbox-col" style="padding-top: 18px">

        <ul class="nav-tabs" role="tablist">
          <li class="active toolbox-tab" data-target="#add-field">Add a Field</li>
          <li class="toolbox-tab" data-target="#field-settings">Field Settings</li>
          <li class="toolbox-tab" data-target="#form-settings">Form Settings</li>
          <li class="toolbox-tab" data-target="#rules">Rules</li>					
        </ul>

        <div class="tab-content">

          <div class="tab-pane active" style="padding: 20px;" id="add-field">

            <div class="col-sm-6">
              <button class="button new-element" data-type="element-single-line-text" style="width: 100%;">Single Line Text</button>
              <button class="button new-element" data-type="element-paragraph-text" style="width: 100%;">Paragraph Text</button>
              <button class="button new-element" data-type="element-multiple-choice" style="width: 100%;">Multiple Choice</button>
              <button class="button grey new-element" data-type="element-section-break" style="width: 100%;">Section Break</button>
            </div>

            <div class="col-sm-6">
              <button class="button new-element" data-type="element-number" style="width: 100%;">Number</button>
              <button class="button new-element" data-type="element-checkboxes" style="width: 100%;">Checkboxes</button>
              <button class="button new-element" data-type="element-dropdown" style="width: 100%;">Dropdown</button>
            </div>

            <div style="clear:both"></div>

            <!--
            <div class="col-sm-12">
              <hr/>
            </div>

            <div class="col-sm-6">
              <button class="button new-element" data-type="element-email" style="width: 100%;">Email</button>
            </div>
            -->

          </div>

          <div class="tab-pane" id="field-settings" style="padding: 20px; display: none; margin: none;">

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

            <div class="section" id="field-options"> 

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

            <div class="section" id="field-description"> 
              
              <div class="form-group">
                <label>Field Description</label>
              </div>

              <div class="field-description">
                <textarea id="description"></textarea>
              </div>

            </div>

            <button class="button danger" id="control-remove-field">Remove</button>&nbsp;
            <button class="button" id="control-add-field">Add Field</button>

          </div>

          <div class="tab-pane" id="form-settings" style="padding: 20px; display: none">

            <div class="section">
              <div class="form-group">
                <label>Title</label>
                <input type="text" class="bind-control form-control" data-bind="#form-title-label" id="form-title" value="" />
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea class="bind-control form-control" data-bind="#form-description-label" id="form-description"></textarea>
              </div>
            </div>

          </div>

					<div class="tab-pane" id="rules" style="padding: 20px; display: none">

						<p>When rules are saved, they can no longer be modified. To override a rule, remove it first and create a new one.</p>

						<div style="margin-bottom: 15px;"><button id="control-add-rule">Add Rule</button></div>			

						<!-- RULES COME HERE -->	
				
					</div>

        </div>

      </div>

      <div class="right-col" id="form-col">

        <div class="loading">
          Loading...
        </div>

      </div>

      <div style="clear: both"></div>

    </div> <!-- /container -->

  </div>

  <div style="clear: both"></div>

</div>

<div style="clear: both"></div>
