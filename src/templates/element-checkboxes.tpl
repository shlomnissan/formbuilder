<li class="form-element {#required}required{/required}" id="element-{position}" data-label="{label}" data-position="{position}" data-type="element-checkboxes">

	<label>
		<span class="label-title">{label}</span>
		{#required}<span class="required-star"> *</span>{/required}
	</label>

	<div class="choices" data-type="settings-choice-checkbox">

		<div class="choice checkbox disabled">
		  <label>
		    <input type="checkbox" class="option-1" name="element-{position}-choice" value="First Choice" disabled>
		    <span class="choice-label">First Choice</span>
		  </label>
		</div>

		<div class="choice checkbox disabled">
		  <label>
		    <input type="checkbox" class="option-2" name="element-{position}-choice" value="Second Choice" disabled>
		    <span class="choice-label">Second Choice</span>
		  </label>
		</div>

		<div class="choice checkbox disabled">
		  <label>
		    <input type="checkbox" class="option-3" name="element-{position}-choice" value="Third Choice" disabled>
		    <span class="choice-label">Third Choice</span>
		  </label>
		</div>
		
	</div>

</li>